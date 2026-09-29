import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Brand from './brand';
import AcademyForm from './academy/form';
import { requestNewsletter } from './newsletter/actions';
import { eduPrograms } from '../lib/edu-programs';
import './edu-footer.css';

export default function EduFooter() {
  return <footer className="ed-site-footer">
    <section className="ed-newsletter edu-container" aria-labelledby="newsletter-heading"><div><span className="edu-label">MỘT CHÚT CẢM HỨNG, MỖI CHẶNG ĐƯỜNG</span><h2 id="newsletter-heading">Giữ kết nối<br/>cùng DolphinX.</h2><p>Đăng ký quan tâm đến bài viết, tài liệu và chương trình học mới.</p></div><div><AcademyForm action={requestNewsletter} label="Đăng ký nhận tin ↗"><label>Email của bạn<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="ban@example.com"/></label><input className="ed-newsletter-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><label className="ed-newsletter-consent"><input name="consent" type="checkbox" required/><span>Tôi đồng ý để DolphinX lưu email và liên hệ về bản tin học tập.</span></label></AcademyForm><p className="ed-newsletter-note">Hiện tiếp nhận đăng ký; chưa gửi email tự động. Muốn rút yêu cầu? <Link href="/contact">Liên hệ đội ngũ.</Link></p></div></section>
    <div className="edu-container ed-footer-links"><div className="ed-footer-brand"><Brand/><p>Công nghệ tạo nên những giá trị thật.<br/>Học, thực hành và cùng nhau tiến bộ.</p><a className="edu-link" href="https://www.dolphinxstudio.com/" target="_blank" rel="noreferrer">DolphinX Studio <ArrowUpRight size={16}/></a></div><nav aria-label="Khám phá DolphinX"><h3>Khám phá</h3><Link href="/about">Về DolphinX</Link><Link href="/people">Con người</Link><Link href="/extracurriculars">Hoạt động</Link><Link href="/blog">Góc chia sẻ</Link></nav><nav aria-label="Các chương trình học"><h3>Chương trình</h3>{eduPrograms.map(program => <Link key={program.slug} href={`/programs/${program.slug}`}>{program.title}</Link>)}</nav><nav aria-label="Kết nối và hỗ trợ"><h3>Cùng kết nối</h3><Link href="/community">Cộng đồng học tập</Link><Link href="/contests">Cuộc thi</Link><Link href="/contact">Liên hệ & tư vấn</Link><Link href="/dashboard">Không gian học tập</Link></nav></div>
    <nav className="edu-container ed-footer-learning" aria-label="Truy cập khu học tập"><span>Tiếp tục khám phá</span><Link href="/programs">Tất cả chương trình</Link><Link href="/courses">Thư viện khóa học</Link><Link href="/roadmaps">Lộ trình công khai</Link><Link href="/dashboard#practice">Luyện code <ArrowUpRight size={15} aria-hidden="true"/></Link></nav>
    <div className="edu-container ed-footer-bottom"><span>© {new Date().getFullYear()} DolphinX Edu</span><span>Ảnh đội ngũ cung cấp. Ảnh chỉnh AI được ghi chú.</span><a href="#main-content">Lên đầu trang ↑</a></div>
  </footer>;
}
