import JournalImage from '@/app/edu-journal-image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
import EduPublicShell from '@/app/edu-public-shell';
import {journal} from '@/lib/edu-journal';
import ArticleHero from '@/app/edu-article-hero';
import '@/app/edu-article-sidebar.css';
import {journalCategories} from '@/lib/edu-journal-categories';
export function generateStaticParams(){return journal.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=journal.find(a=>a.slug===slug);return {title:a?`${a.title} — DolphinX Edu`:'Không tìm thấy bài viết',description:a?.intro};}
export default async function Article({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const a=journal.find(a=>a.slug===slug);
  if(!a)notFound();
  const related = journal.filter(item=>item.slug!==slug)
    .sort((left,right)=>Number(right.category===a.category)-Number(left.category===a.category))
    .slice(0,3);
  return <EduPublicShell>
    <ArticleHero title={a.title} category={a.category} image={a.image} intro={a.intro}/>
    <div className="edu-container ed-article-layout ed-article-editorial-layout">
      <aside className="ed-article-sidebar">
        <div className="ed-article-publication"><span className="edu-label">DOLPHINX JOURNAL</span><p>Ghi chép học tập</p><small>{a.category} · Hướng dẫn thực hành</small></div>
        <nav aria-label="Mục lục bài viết"><span className="edu-label">TRONG BÀI NÀY</span>{a.sections.map(([heading],i)=><a href={`#section-${i}`} key={heading}>{heading}</a>)}<a href="#try-it">Một việc để thử</a></nav>
        <nav aria-label="Bài đọc gợi ý" className="ed-article-suggestions"><span className="edu-label">TIẾP TỤC KHÁM PHÁ</span>{related.slice(0,2).map(item=><Link href={`/blog/${item.slug}`} key={item.slug}><span>{item.category}</span>{item.title}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</nav>
        <nav aria-label="Danh mục bài viết" className="ed-article-categories"><span className="edu-label">CHỦ ĐỀ</span>{journalCategories.map(category=><Link href={`/blog/category/${category.slug}`} key={category.slug}>{category.name}</Link>)}</nav>
      </aside>
      <article>{a.sections.map(([heading,...paragraphs],i)=><section id={`section-${i}`} key={heading}><h2>{heading}</h2>{paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}<section className="ed-article-exercise" id="try-it"><span className="edu-label">MỘT VIỆC ĐỂ THỬ</span><h2>Đọc xong, bắt tay vào làm.</h2><p>{a.exercise}</p><Link className="edu-button" href={a.href}>{a.cta}<ArrowUpRight size={18}/></Link></section></article>
    </div>
    <section className="edu-container edu-section" data-reveal><h2>Đọc thêm một góc nhìn.</h2><div className="ed-article-related">{related.map(item=><Link href={`/blog/${item.slug}`} key={item.slug}><JournalImage image={item.image} sizes="(max-width:650px) 90vw, 30vw"/><span className="edu-label">{item.category}</span><h3>{item.title}</h3><span className="edu-link">Đọc bài viết <ArrowUpRight size={18}/></span></Link>)}</div></section>
  </EduPublicShell>;
}
