import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getManagedContent } from "@/lib/managed-content";
import AcademyForm from "@/app/academy/form";
import { saveLibrary, addCurriculum } from "./actions";
import "@/app/academy.css";
export const dynamic = "force-dynamic";
export default async function LibraryAdmin() {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const entries = await getManagedContent(true);
  return <main className="academy library-admin"><header><Link href="/admin">← Quản trị</Link><Link href="/resources">Xem tài nguyên</Link></header><h1>Tài nguyên & lộ trình</h1><p>Biên tập toàn bộ nội dung, bài thực hành và từng chặng lộ trình. Giữ nguyên slug/ID chủ đề khi sửa để bảo toàn tiến độ học viên. Bỏ chọn “Xuất bản” để ẩn mà không mất dữ liệu.</p><section><h2>Bổ sung giáo trình</h2><p>4 khóa mới: kéo thả, JavaScript, TypeScript và Git; mỗi khóa 5 bài demo kèm giáo án. Nhập lại không ghi đè nội dung đã sửa.</p><AcademyForm action={addCurriculum} label="Nhập 4 khóa và 20 bài demo">{null}</AcademyForm></section><section className="academy-grid">{entries.map(entry => <details key={entry._id}><summary>{entry.kind === "resource" ? "Tài nguyên" : "Lộ trình"} · {entry.slug} · {entry.published ? "Đã xuất bản" : "Đang ẩn"}</summary><AcademyForm action={saveLibrary} label="Lưu nội dung"><input type="hidden" name="kind" value={entry.kind}/><input type="hidden" name="slug" value={entry.slug}/><label>Nội dung JSON<textarea name="content" aria-label={`Nội dung ${entry.slug}`} rows={18} defaultValue={JSON.stringify(entry.data, null, 2)} required/></label><label><input type="checkbox" name="published" defaultChecked={entry.published}/> Xuất bản</label></AcademyForm></details>)}</section><section><h2>Thêm nội dung mới</h2><p>Sao chép cấu trúc từ một mục phía trên. Đổi id (tài nguyên) hoặc roadmap.slug (lộ trình) cho khớp slug mới. Lộ trình gồm roadmap và guide, số chặng phải bằng nhau.</p><AcademyForm action={saveLibrary} label="Tạo nội dung"><label>Loại<select name="kind"><option value="resource">Tài nguyên</option><option value="roadmap">Lộ trình</option></select></label><label>Slug<input name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" required/></label><label>Nội dung JSON<textarea name="content" rows={12} required/></label><label><input type="checkbox" name="published"/> Xuất bản ngay</label></AcademyForm></section></main>;
}
