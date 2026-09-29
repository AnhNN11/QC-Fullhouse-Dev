"use server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMongoDatabase } from "@/lib/mongodb";
import { contentSlug, validateResource, validateRoadmap } from "@/lib/content-validation";
import type { ContentEntry } from "@/lib/managed-content";
import { importExpandedCurriculum } from "@/lib/import-expanded-curriculum";
export async function addCurriculum() {
  if (!await isAdminAuthenticated()) return { error: "Vui lòng đăng nhập admin." };
  try {
    const result = await importExpandedCurriculum();
    for (const path of ["/courses", "/dashboard", "/admin", "/admin/academy"]) revalidatePath(path);
    return { success: `Đã nhập ${result.courses} khóa / ${result.lessons} bài demo, giữ nguyên nội dung đã chỉnh sửa.` };
  } catch { return { error: "Chưa nhập được giáo trình. Vui lòng thử lại." }; }
}
export async function saveLibrary(_: { error?: string; success?: string }, form: FormData) {
  if (!await isAdminAuthenticated()) return { error: "Vui lòng đăng nhập admin." };
  try {
    const kind = form.get("kind");
    if (kind !== "resource" && kind !== "roadmap") throw new Error("Loại nội dung không hợp lệ.");
    const slug = contentSlug(form.get("slug")), raw = String(form.get("content") ?? "");
    if (raw.length > 150000) throw new Error("Nội dung tối đa 150KB.");
    const parsed: unknown = JSON.parse(raw);
    const data = kind === "resource" ? validateResource(parsed, slug) : validateRoadmap(parsed, slug);
    await (await getMongoDatabase()).collection<ContentEntry>("managed_content").updateOne({ _id: `${kind}:${slug}` }, { $set: { kind, slug, data, published: form.get("published") === "on", updatedAt: new Date() } }, { upsert: true });
    for (const path of ["/", "/resources", `/resources/${slug}`, "/roadmaps", `/roadmaps/${slug}`, "/admin/library"]) revalidatePath(path);
    return { success: "Đã lưu. Nội dung xuất bản được cập nhật trên trang công khai; bỏ chọn xuất bản để ẩn." };
  } catch (error) { return { error: error instanceof Error ? error.message : "Không thể lưu nội dung." }; }
}
