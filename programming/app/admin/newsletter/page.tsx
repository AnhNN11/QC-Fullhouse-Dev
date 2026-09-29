import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getMongoDatabase } from '@/lib/mongodb';
import type { NewsletterRequest } from '@/lib/newsletter';
import AcademyForm from '@/app/academy/form';
import { suppressNewsletter } from '@/app/newsletter/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import '../../academy.css';

export const dynamic = 'force-dynamic';
export default async function NewsletterAdmin({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!await isAdminAuthenticated()) redirect('/admin');
  const { page: raw } = await searchParams;
  const parsed = Number(raw ?? 1);
  const page = Number.isSafeInteger(parsed) && parsed > 0 ? Math.min(parsed, 10000) : 1;
  const db = await getMongoDatabase();
  const collection = db.collection<NewsletterRequest>('newsletter_requests');
  const [total, rows] = await Promise.all([collection.countDocuments(), collection.find().sort({ createdAt: -1, _id: 1 }).skip((page - 1) * 30).limit(30).toArray()]);
  return <main className="academy academy-admin"><header><Link href="/admin">← Trung tâm quản trị</Link><Link href="/admin/academy">Yêu cầu tư vấn →</Link></header><h1>Đăng ký nhận tin</h1><p>Danh sách yêu cầu từ footer công khai. Chưa xác minh quyền sở hữu email và chưa kết nối dịch vụ gửi thư; không dùng danh sách này để gửi hàng loạt khi chưa xác nhận.</p><Card><CardHeader><CardTitle>{total} yêu cầu · Trang {page}</CardTitle></CardHeader><CardContent>{rows.length ? rows.map(row=><article className="academy-admin-row" key={row._id}><div><strong>{row.email}</strong><p>{row.createdAt.toLocaleDateString('vi-VN')} · {row.status === 'suppressed' ? 'Không gửi tin' : 'Đã yêu cầu — chưa xác minh email'}</p></div>{row.status !== 'suppressed' && <AcademyForm action={suppressNewsletter} label="Đánh dấu không gửi"><input type="hidden" name="id" value={row._id}/></AcademyForm>}</article>) : <p>Chưa có yêu cầu trên trang này.</p>}<nav aria-label="Phân trang đăng ký nhận tin" className="academy-admin-row">{page > 1 && <Link href={`/admin/newsletter?page=${page-1}`}>← Trang trước</Link>}{page*30 < total && <Link href={`/admin/newsletter?page=${page+1}`}>Trang tiếp →</Link>}</nav></CardContent></Card></main>;
}
