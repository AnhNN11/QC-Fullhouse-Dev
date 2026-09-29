import Link from "next/link";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getBlockChallenges, type BlockResult } from "@/lib/block-store";
import { getMongoDatabase } from "@/lib/mongodb";
import AcademyForm from "@/app/academy/form";
import { saveBlockChallenge } from "./actions";
import { blockSolutions } from "@/lib/block-solutions";
import "@/app/academy.css";
export const dynamic = "force-dynamic";
export default async function BlocksAdmin() {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const entries = await getBlockChallenges(true), db = await getMongoDatabase();
  const results = await db.collection<BlockResult>("block_results").find().sort({ updatedAt: -1 }).limit(100).toArray();
  const userIds = [...new Set(results.map(r => r.userId))].filter(id => ObjectId.isValid(id));
  const users = await db.collection("users").find({ _id: { $in: userIds.map(id => new ObjectId(id)) } }, { projection: { name: 1 } }).toArray();
  const saved = await db.collection("block_challenges").find({}, { projection: { solution: 1 } }).toArray();
  return <main className="academy library-admin"><header><Link href="/admin">← Quản trị</Link><Link href="/resources/blocks">Xem phòng khối lệnh →</Link></header><h1>Khối lệnh & điểm thực hành</h1><p>Quản lý đề, bản đồ, khối được phép và ngân sách khối. Khi xuất bản cần lời giải tham chiếu đạt 100 điểm. Hướng 0=phải, 1=xuống, 2=trái, 3=lên. Điểm học viên luôn được máy chủ tính lại.</p><section><h2>Thử thách</h2>{entries.map(({ challenge, published }) => <details key={challenge.slug}><summary>{challenge.title} · {published ? "Đã xuất bản" : "Đang ẩn"}</summary><AcademyForm action={saveBlockChallenge} label="Lưu thử thách"><input type="hidden" name="originalSlug" value={challenge.slug}/><label>Cấu hình đề (JSON)<textarea name="challenge" rows={20} required defaultValue={JSON.stringify(challenge, null, 2)}/></label><label>Lời giải tham chiếu (mảng khối JSON)<textarea name="solution" rows={8} defaultValue={JSON.stringify(saved.find(s => s._id.toString() === challenge.slug)?.solution ?? blockSolutions[challenge.slug] ?? [], null, 2)}/></label><p>Ví dụ: [{`{"id":"a","kind":"move","count":3}`}]. Khối repeat cần body; ifClear cần body và otherwise. Các id trong chương trình phải khác nhau.</p><label><input name="published" type="checkbox" defaultChecked={published}/> Xuất bản</label></AcademyForm></details>)}</section><section><h2>Thêm thử thách</h2><AcademyForm action={saveBlockChallenge} label="Tạo thử thách"><label>Cấu hình JSON<textarea name="challenge" rows={14} required placeholder="Sao chép cấu trúc từ một bài phía trên, đổi slug và cấu hình bản đồ."/></label><label>Lời giải tham chiếu<textarea name="solution" rows={8} placeholder='[{"id":"a","kind":"move","count":3}]'/></label><label><input type="checkbox" name="published"/> Xuất bản sau khi kiểm tra lời giải</label></AcademyForm></section><section><h2>100 kết quả cập nhật gần nhất</h2><p>Mỗi dòng là một học viên / bài / phiên bản đề. Kỷ lục không bị giảm khi nộp bài điểm thấp hơn.</p>{results.length ? results.map(result => <details key={result._id}><summary>{users.find(u => u._id.toString() === result.userId)?.name ?? "Tài khoản không còn tồn tại"} · {result.slug} · Kỷ lục {result.bestScore}/100 · Lần gần nhất {result.lastScore}/100</summary><p>{result.attempts} lần nộp · {result.updatedAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} · Phiên bản {result.revision}</p><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(result.program, null, 2)}</pre></details>) : <p>Chưa có bài nộp.</p>}</section></main>;
}
