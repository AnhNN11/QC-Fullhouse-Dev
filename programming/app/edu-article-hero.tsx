import Image from 'next/image';
import Link from 'next/link';
import EduHeadline from './edu-headline';
import { journalImageDescriptions } from '@/lib/edu-journal-media';
import './edu-article-hero.css';

export default function ArticleHero({title,category,image,intro}:{title:string;category:string;image:string;intro:string}) {
  return <>
    <header className="ed-article-banner">
      <div className="edu-container"><Link href="/blog" className="edu-link">← Góc học tập</Link></div>
      <div className="ed-article-title-panel"><span className="edu-label">{category} / DOLPHINX JOURNAL</span><EduHeadline text={title}/></div>
      <figure><Image src={`/brand/company/${image}`} alt={journalImageDescriptions[image] ?? 'Ảnh tư liệu do đội ngũ DolphinX cung cấp'} width={1920} height={1280} loading="eager" fetchPriority="high" sizes="100vw"/><figcaption>Ảnh tư liệu do đội ngũ cung cấp.</figcaption></figure>
    </header>
    <div className="edu-container"><p className="ed-article-intro">{intro}</p></div>
  </>;
}
