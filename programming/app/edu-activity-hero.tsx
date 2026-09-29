import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { activityMedia } from '@/lib/edu-activity-media';
import './edu-activity-detail.css';

export default function ActivityHero({ slug, title, category, href, cta }: { slug:string; title:string; category:string; href:string; cta:string }) {
  const media = activityMedia[slug];
  const companion = activityMedia[slug === 'code-review' ? 'project-lab' : 'code-review'];
  return <section className="ed-activity-hero"><div className="edu-container"><Link href="/extracurriculars" className="edu-link">← Tất cả hoạt động</Link><div className="ed-activity-hero-grid"><div className="ed-activity-main-photo"><Image src={companion.src} alt={companion.alt} width={2048} height={1365} loading="eager" fetchPriority="high" sizes="(max-width:750px) 90vw, 46vw"/><span>{companion.note}</span></div><div className="ed-activity-hero-copy"><span className="edu-label">HOẠT ĐỘNG / {category.toUpperCase()}</span><EduHeadline text={title}/><Link className="edu-button" href={href}>{cta} <ArrowUpRight size={18}/></Link><div className="ed-activity-secondary-photo"><Image src={media.src} alt={media.alt} width={1536} height={1024} sizes="(max-width:750px) 90vw, 46vw"/><span>{media.note}</span></div></div></div></div></section>;
}

export function ActivityConnections() {
  const portraits = [
    { image: 'representative-navy-v1.png', alt: 'Chân dung đại diện tóc đen trong đồng phục navy' },
    { image: 'representative-white-v1.png', alt: 'Chân dung đại diện tóc sáng đeo kính trong đồng phục trắng' },
    { image: 'seaside-studio-v1.png', alt: 'Chân dung đại diện tóc đen trong studio, mặc polo navy' },
    { image: 'lakeside-studio-v1.png', alt: 'Chân dung đại diện trong studio, mặc polo trắng' },
  ];
  return <section className="edu-section edu-container ed-activity-connections ed-activity-representatives" data-reveal>
    <header><span className="edu-label">CON NGƯỜI & KẾT NỐI</span><h2>Gặp gỡ DolphinX.<br/>Cùng mở rộng góc nhìn.</h2><p>Những cá tính riêng, cùng tinh thần học hỏi và chia sẻ.</p></header>
    <div className="ed-activity-representative-grid">{portraits.map(portrait => <figure key={portrait.image}><Image src={`/brand/company/${portrait.image}`} alt={portrait.alt} width={1024} height={1536} sizes="(max-width:600px) 90vw, (max-width:1450px) 44vw, 23vw"/></figure>)}</div>
    <div className="ed-activity-representative-footer"><small>Ảnh đại diện đội ngũ, không phải danh sách thành viên của hoạt động. Đồng phục và nền studio được chỉnh bằng AI từ ảnh cung cấp.</small><Link href="/people" className="edu-link">Con người DolphinX <ArrowUpRight size={18}/></Link><Link href="/community" className="edu-link">Mở khu trao đổi <ArrowUpRight size={18}/></Link></div>
  </section>;
}
import EduHeadline from './edu-headline';
