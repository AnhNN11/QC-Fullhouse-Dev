import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { entityConfigs, isEntityName } from "@/lib/entity-config";
import { getDatabase } from "@/lib/mongodb";

function cleanPayload(
  body: Record<string, unknown>,
  allowed: readonly string[],
) {
  return Object.fromEntries(
    Object.entries(body).filter(
      ([key, value]) => allowed.includes(key) && value !== undefined,
    ),
  );
}

function validateRequired(
  payload: Record<string, unknown>,
  required: readonly string[],
) {
  return required.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getConfig(context: RouteContext<"/api/manage/[entity]">) {
  const { entity } = await context.params;
  if (!isEntityName(entity)) return null;
  return { entity, config: entityConfigs[entity] };
}

function validateContestTimes(payload: Record<string, unknown>) {
  const start = new Date(String(payload.startTime)).getTime();
  const end = new Date(String(payload.endTime)).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "Thời gian contest không hợp lệ.";
  if (end <= start) return "Thời gian kết thúc phải sau thời gian bắt đầu.";
  return null;
}

async function contestTeacherExists(payload: Record<string, unknown>) {
  const teacherId = String(payload.teacherId ?? "");
  if (!ObjectId.isValid(teacherId)) return false;
  const db = await getDatabase();
  return Boolean(await db.collection("teachers").findOne(
    { _id: new ObjectId(teacherId) },
    { projection: { _id: 1 } },
  ));
}

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/manage/[entity]">,
) {
  const resolved = await getConfig(context);
  if (!resolved) return NextResponse.json({ error: "Loại dữ liệu không hợp lệ." }, { status: 404 });

  try {
    const db = await getDatabase();
    const search = request.nextUrl.searchParams.get("search")?.trim().slice(0, 100);
    const safeSearch = search ? escapeRegex(search) : "";
    const query = search
      ? { $or: ["name", "code", "subject", "topic"].map((field) => ({ [field]: { $regex: safeSearch, $options: "i" } })) }
      : {};
    const items = await db.collection(resolved.config.collection)
      .find(query)
      .sort(resolved.config.sort)
      .toArray();

    return NextResponse.json({
      items: items.map(({ _id, ...item }) => ({ id: _id.toString(), ...item })),
    });
  } catch (error) {
    console.error("CRUD GET error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể tải dữ liệu." }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/manage/[entity]">,
) {
  const resolved = await getConfig(context);
  if (!resolved) return NextResponse.json({ error: "Loại dữ liệu không hợp lệ." }, { status: 404 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = {
      ...resolved.config.defaults,
      ...cleanPayload(body, resolved.config.allowed),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const missing = validateRequired(payload, resolved.config.required);
    if (missing.length) {
      return NextResponse.json({ error: `Thiếu trường bắt buộc: ${missing.join(", ")}` }, { status: 400 });
    }
    if (resolved.entity === "contests") {
      const timeError = validateContestTimes(payload);
      if (timeError) return NextResponse.json({ error: timeError }, { status: 400 });
      if (!await contestTeacherExists(payload)) return NextResponse.json({ error: "Giáo viên phụ trách không tồn tại." }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection(resolved.config.collection).insertOne(payload);
    return NextResponse.json({ id: result.insertedId.toString(), message: "Đã tạo dữ liệu mới." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("E11000")
      ? "Mã này đã tồn tại."
      : "Không thể tạo dữ liệu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/manage/[entity]">,
) {
  const resolved = await getConfig(context);
  if (!resolved) return NextResponse.json({ error: "Loại dữ liệu không hợp lệ." }, { status: 404 });

  try {
    const body = (await request.json()) as Record<string, unknown> & { id?: string };
    if (!body.id || !ObjectId.isValid(body.id)) {
      return NextResponse.json({ error: "ID không hợp lệ." }, { status: 400 });
    }
    const payload = cleanPayload(body, resolved.config.allowed);
    const missing = validateRequired(payload, resolved.config.required);
    if (missing.length) {
      return NextResponse.json({ error: `Thiếu trường bắt buộc: ${missing.join(", ")}` }, { status: 400 });
    }
    if (resolved.entity === "contests") {
      const timeError = validateContestTimes(payload);
      if (timeError) return NextResponse.json({ error: timeError }, { status: 400 });
      if (!await contestTeacherExists(payload)) return NextResponse.json({ error: "Giáo viên phụ trách không tồn tại." }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection(resolved.config.collection).updateOne(
      { _id: new ObjectId(body.id) },
      { $set: { ...payload, updatedAt: new Date() } },
    );
    if (!result.matchedCount) return NextResponse.json({ error: "Không tìm thấy dữ liệu." }, { status: 404 });
    return NextResponse.json({ message: "Đã cập nhật dữ liệu." });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("E11000")
      ? "Mã này đã tồn tại."
      : "Không thể cập nhật dữ liệu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/manage/[entity]">,
) {
  const resolved = await getConfig(context);
  if (!resolved) return NextResponse.json({ error: "Loại dữ liệu không hợp lệ." }, { status: 404 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID không hợp lệ." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const dependencies = {
      teachers: [
        { collection: "course_classes", field: "teacherId", label: "lớp học" },
        { collection: "contests", field: "teacherId", label: "contest" },
      ],
      courses: [{ collection: "course_classes", field: "courseId", label: "lớp học" }],
      classes: [{ collection: "class_sessions", field: "classId", label: "buổi học" }],
      sessions: [{ collection: "qc_evaluations", field: "sessionId", label: "phiếu đánh giá" }],
      contests: [],
    } as const;
    for (const dependency of dependencies[resolved.entity]) {
      const linkedCount = await db.collection(dependency.collection).countDocuments({ [dependency.field]: id });
      if (linkedCount > 0) {
        return NextResponse.json(
          { error: `Không thể xóa vì dữ liệu đang được sử dụng bởi ${linkedCount} ${dependency.label}.` },
          { status: 409 },
        );
      }
    }
    const result = await db.collection(resolved.config.collection).deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return NextResponse.json({ error: "Không tìm thấy dữ liệu." }, { status: 404 });
    return NextResponse.json({ message: "Đã xóa dữ liệu." });
  } catch (error) {
    console.error("CRUD DELETE error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể xóa dữ liệu." }, { status: 500 });
  }
}
