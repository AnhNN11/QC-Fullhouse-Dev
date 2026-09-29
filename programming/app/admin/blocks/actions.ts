"use server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMongoDatabase } from "@/lib/mongodb";
import { validateChallenge } from "@/lib/blocks";
import { gradeBlocks } from "@/lib/blocks";
import type { StoredChallenge } from "@/lib/block-store";
export async function saveBlockChallenge(_: { error?: string; success?: string }, form: FormData) {
  if (!await isAdminAuthenticated()) return { error: "Vui lòng đăng nhập admin." };
  try {
    const raw = String(form.get("challenge") ?? ""), solution = String(form.get("solution") ?? "");
    if (raw.length > 30000 || solution.length > 20000) throw new Error("Cấu hình hoặc lời giải quá dài.");
    const challenge = validateChallenge(JSON.parse(raw));
    const original = form.get("originalSlug");
    if (original && challenge.slug !== original) throw new Error("Không đổi slug bài hiện có. Hãy tạo bài mới để giữ lịch sử điểm.");
    const published = form.get("published") === "on";
    if (published && (!solution || gradeBlocks(challenge, JSON.parse(solution)).score !== 100)) throw new Error("Cần lời giải khối lệnh đạt 100 điểm trên mọi bản đồ trước khi xuất bản.");
    const collection = (await getMongoDatabase()).collection<StoredChallenge & { solution?: unknown }>("block_challenges");
    if (!original) {
      const { blockChallenges } = await import("@/lib/block-challenges");
      if (blockChallenges.some(item => item.slug === challenge.slug) || await collection.findOne({ _id: challenge.slug })) throw new Error("Slug đã tồn tại; hãy mở mục tương ứng để chỉnh sửa.");
    }
    await collection.updateOne({ _id: challenge.slug }, { $set: { challenge, published, ...(solution ? { solution: JSON.parse(solution) } : {}), updatedAt: new Date() } }, { upsert: true });
    revalidatePath("/resources/blocks"); revalidatePath(`/resources/blocks/${challenge.slug}`); revalidatePath("/admin/blocks");
    return { success: "Đã lưu thử thách. Điểm được phân biệt theo phiên bản cấu hình; điểm cũ vẫn giữ trong lịch sử." };
  } catch (error) { return { error: error instanceof Error ? error.message : "Chưa lưu được thử thách." }; }
}
