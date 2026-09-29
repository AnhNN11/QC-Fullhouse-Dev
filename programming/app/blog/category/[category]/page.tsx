import Image from 'next/image';
import JournalImage from '@/app/edu-journal-image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import EduPublicShell from '@/app/edu-public-shell';
import JournalCategories from '@/app/edu-journal-categories';
import { journal } from '@/lib/edu-journal';
import { journalCategories } from '@/lib/edu-journal-categories';

type Props = { params: Promise<{ category: string }> };
export function generateStaticParams() {
  return journalCategories.map(({ slug }) => ({ category: slug }));
}
export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const item = journalCategories.find(item => item.slug === category);
  return { title: item ? `${item.name} — Góc học tập DolphinX Edu` : 'Không tìm thấy danh mục', description: item?.description };
}
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const item = journalCategories.find(item => item.slug === category);
  if (!item) notFound();
  const articles = journal.filter(article => article.category === item.name);
  return <EduPublicShell>
    <header className="ed-category-hero">
      <Image src="/brand/company/presentation-original.png" alt="Ảnh thuyết trình do đội ngũ cung cấp" width={1920} height={1280} loading="eager" fetchPriority="high" sizes="100vw" />
      <div><span className="edu-label">DOLPHINX JOURNAL</span><EduHeadline text={item.name}/></div>
    </header>
    <section className="edu-container" aria-label={`Bài viết về ${item.name}`}>
      <JournalCategories current={item.slug} />
      <p className="ed-category-description">{item.description}</p>
      <div className="ed-category-grid">{articles.map(article => <Link href={`/blog/${article.slug}`} key={article.slug}>
        <div><JournalImage image={article.image} sizes="(max-width:650px) 90vw, 45vw"/></div>
        <span className="edu-label">{article.category}</span>
        <h2>{article.title}</h2><p>{article.intro}</p>
        <span className="edu-link">Đọc bài viết <ArrowUpRight size={18} aria-hidden="true" /></span>
      </Link>)}</div>
    </section>
  </EduPublicShell>;
}
import EduHeadline from '@/app/edu-headline';
