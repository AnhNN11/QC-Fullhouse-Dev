import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) return Response.json({ error: "Buổi học không hợp lệ." }, { status: 400 });

  const db = await getDatabase();
  const session = await db.collection("class_sessions").findOne(
    { _id: new ObjectId(id), sourceSystem: "fullhousedev", sourceActive: { $ne: false } },
    { projection: { notebookAudioFile: 1, contestCode: 1, sessionNo: 1 } },
  );
  const storedFileName = typeof session?.notebookAudioFile === "string" ? session.notebookAudioFile : "";
  const safeFileName = path.basename(storedFileName);
  if (!safeFileName || safeFileName !== storedFileName) {
    return Response.json({ error: "Buổi học chưa có file audio hoàn chỉnh." }, { status: 404 });
  }

  const outputDirectory = path.resolve(/* turbopackIgnore: true */ process.env.RECORDING_OUTPUT_DIR?.trim() || path.join(process.cwd(), "storage", "recordings"));
  const filePath = path.join(/* turbopackIgnore: true */ outputDirectory, safeFileName);
  try {
    const stats = await fs.stat(/* turbopackIgnore: true */ filePath);
    if (!stats.isFile()) throw new Error("NOT_A_FILE");
    const stream = Readable.toWeb(createReadStream(/* turbopackIgnore: true */ filePath));
    const downloadName = `${String(session?.contestCode ?? "fullhouse")}-buoi-${String(session?.sessionNo ?? "recording")}-notebooklm.mp3`;
    return new Response(stream as ReadableStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(stats.size),
        "Content-Disposition": `attachment; filename="${downloadName.replace(/[^a-zA-Z0-9._-]/g, "-")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return Response.json({ error: "File audio không còn trên máy local. Hãy crawl lại buổi học này." }, { status: 404 });
  }
}
