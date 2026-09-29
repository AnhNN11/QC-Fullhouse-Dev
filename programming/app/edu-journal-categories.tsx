import Link from 'next/link';
import { journalCategories } from '@/lib/edu-journal-categories';
import './edu-journal-categories.css';

export default function JournalCategories({ current }: { current?: string }) {
  return <nav className="ed-journal-categories" aria-label="Danh mục bài viết">
    <Link href="/blog" aria-current={!current ? 'page' : undefined}>Tất cả bài viết</Link>
    {journalCategories.map(category => <Link
      key={category.slug}
      href={`/blog/category/${category.slug}`}
      aria-current={current === category.slug ? 'page' : undefined}
    >{category.name}</Link>)}
  </nav>;
}
