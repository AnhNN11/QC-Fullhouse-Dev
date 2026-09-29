'use client';

import { useEffect, useRef } from 'react';
import './edu-motion.css';

/** Content is visible without JS; motion only enhances supported browsers. */
export default function EduMotion({children}:{children:React.ReactNode}) {
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const container=root.current;
    const elements=container?.querySelectorAll<HTMLElement>('[data-reveal]');
    if(media.matches || !elements || !('IntersectionObserver' in window)) return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:0.08});
    elements.forEach(element=>{element.classList.add('reveal-ready');observer.observe(element);});
    const show=()=>elements.forEach(element=>element.classList.add('is-visible'));
    const revealFocused=(event:FocusEvent)=>{
      if(!(event.target instanceof Element)) return;
      let element=event.target.closest<HTMLElement>('[data-reveal]');
      while(element && container?.contains(element)) {
        element.classList.add('is-visible');
        observer.unobserve(element);
        element=element.parentElement?.closest<HTMLElement>('[data-reveal]') ?? null;
      }
    };
    media.addEventListener('change',show);
    container?.addEventListener('focusin',revealFocused);
    return ()=>{
      observer.disconnect();
      media.removeEventListener('change',show);
      container?.removeEventListener('focusin',revealFocused);
      // Restore progressive visibility without marking unseen sections as revealed.
      // React Strict Mode runs setup/cleanup/setup during development.
      elements.forEach(element=>element.classList.remove('reveal-ready'));
    };
  },[]);
  return <div ref={root}>{children}</div>;
}
