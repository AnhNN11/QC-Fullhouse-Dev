import type { CSSProperties } from 'react';
import './edu-headline.css';

/** Server-rendered words preserve Vietnamese combining characters and native wrapping. */
export default function EduHeadline({ text }: { text: string }) {
  const words = text.trim().split(/\s+/u);
  return <h1 className="ed-animated-headline" aria-label={text}>
    {words.map((word, index) => <span key={`${index}-${word}`} aria-hidden="true">
      <span className="ed-headline-word" style={{ '--word-delay': `${Math.min(index, 16) * 28}ms` } as CSSProperties}>{word}</span>{index < words.length - 1 ? ' ' : ''}
    </span>)}
  </h1>;
}
