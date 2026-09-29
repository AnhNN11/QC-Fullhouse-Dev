import Image from 'next/image';
import JournalImage from '@/app/edu-journal-image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import EduPublicShell from '../edu-public-shell';
import {journal} from '@/lib/edu-journal';
import JournalCategories from '../edu-journal-categories';
export const metadata={title:'Góc học tập — DolphinX Edu'};
export default function Blog() {
  const featured = journal[0];
  return <EduPublicShell>
    <section className="ed-category-hero ed-journal-photo-hero">
      <Image src="/brand/company/team-collaboration-no-badge-v3.png" alt="Ảnh ghép AI bốn gương mặt đại diện DolphinX mặc đồng phục navy và trắng cùng trao đổi bên laptop" width={1536} height={1024} loading="eager" fetchPriority="high" sizes="100vw"/>
      <div><span className="edu-label">DOLPHINX JOURNAL</span><h1>Góc nhìn nhỏ.<br/>Bước tiến mới.</h1></div>
    </section>
    <div className="edu-container ed-journal-intro"><p>Ghi chép về việc học, thực hành và làm sản phẩm.<br/>Đọc một điều, thử một việc, rồi chia sẻ điều bạn nhận ra.</p><small>Ảnh tập thể ghép AI từ chân dung đội ngũ; bối cảnh studio minh họa.</small></div>
    <div className="edu-container"><JournalCategories/></div>
    <section className="edu-container ed-journal-opening" aria-label="Các bài hướng dẫn">
      <div className="ed-journal-grid">{journal.slice(1,7).map(a=><Link href={`/blog/${a.slug}`} key={a.slug}>
        <div><JournalImage image={a.image} sizes="(max-width:600px) 90vw, (max-width:850px) 45vw, 30vw"/></div>
        <span className="edu-label">{a.category}</span><h2>{a.title}</h2><p>{a.intro}</p><span className="edu-link">Đọc tiếp <ArrowUpRight size={18}/></span>
      </Link>)}</div>
    </section>
    <section className="edu-container ed-journal-feature">
      <Link href={`/blog/${featured.slug}`}>
        <Image src={`/brand/company/${featured.image}`} alt="Ảnh trao đổi nhóm do đội ngũ cung cấp" width={1920} height={1280} sizes="(max-width:800px) 90vw,60vw"/>
        <div><span className="edu-label">BÀI ĐỌC NỔI BẬT / {featured.category}</span><h2>{featured.title}</h2><p>{featured.intro}</p><span className="edu-link">Đọc bài viết <ArrowUpRight size={20}/></span></div>
      </Link>
    </section>
    <section className="edu-section edu-container" data-reveal>
      <div className="edu-section-head"><h2>Mang một ý tưởng<br/>vào buổi học tiếp theo.</h2><p>Các bài hướng dẫn ngắn, kèm một việc bạn có thể tự thử. Nội dung biên soạn cho góc học tập DolphinX Edu.</p></div>
      <div className="ed-journal-grid">{journal.slice(7).map(a=><Link href={`/blog/${a.slug}`} key={a.slug}>
        <div><JournalImage image={a.image} sizes="(max-width:650px) 90vw,30vw"/></div>
        <span className="edu-label">{a.category}</span><h3>{a.title}</h3><p>{a.intro}</p><span className="edu-link">Đọc tiếp <ArrowUpRight size={18}/></span>
      </Link>)}</div>
    </section>
  </EduPublicShell>;
}
