import JournalImage from '@/app/edu-journal-image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { journal } from '@/lib/edu-journal';
import './edu-home-editorial.css';
import EduGallery from './edu-gallery';
import EduHomeEvents from './edu-home-events';
import PeopleCarousel from './edu-people-carousel';

export default function EduHomeEditorial() {
  return <>
    <EduHomeEvents/>
    <EduGallery/>
    <PeopleCarousel showDirectoryLink/>
  </>;
}

export function EduHomeJournal() {
  return (
    <section className="edu-section edu-container"><div className="edu-section-head"><div><span className="edu-label">GÓC CHIA SẺ</span><h2>Thêm một góc nhìn.<br/><span>Thêm một bước tiến.</span></h2></div><Link className="edu-link" href="/blog">Xem tất cả bài viết <ArrowUpRight size={18}/></Link></div><div className="edu-home-journal">{journal.slice(0,3).map(article=><Link key={article.slug} href={`/blog/${article.slug}`}><div><JournalImage image={article.image} sizes="(max-width:700px) 90vw, 30vw"/></div><span className="edu-label">{article.category}</span><h3>{article.title}</h3><span className="edu-link">Đọc bài viết <ArrowUpRight size={17}/></span></Link>)}</div></section>
  );
}
