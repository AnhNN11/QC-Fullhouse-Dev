'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './edu-people-carousel.css';

const portraits = [
  ['representative-navy-v1.png', 'Cùng chia sẻ kiến thức', 'Chân dung tóc đen mặc polo navy'],
  ['representative-white-v1.png', 'Cùng mở rộng góc nhìn', 'Chân dung tóc sáng đeo kính mặc polo trắng'],
  ['seaside-studio-v1.png', 'Tự tin theo cách riêng', 'Chân dung tóc đen mặc polo navy trong studio'],
  ['lakeside-studio-v1.png', 'Một góc nhìn mới', 'Chân dung mặc polo trắng trong studio'],
  ['street-studio-v1.png', 'Sẵn sàng kết nối', 'Chân dung mang túi mặc polo navy'],

] as const;

export default function PeopleCarousel({ showDirectoryLink = false }: { showDirectoryLink?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener('scroll', update); };
  }, []);
  function move(direction: number) {
    const element = track.current;
    const card = element?.firstElementChild;
    if (!element || !card) return;
    const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({ left: direction * distance, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section className="edu-container edu-section ed-team-carousel" aria-labelledby="team-carousel-title">
    <div className="edu-section-head"><div><span className="edu-label">GƯƠNG MẶT ĐẠI DIỆN</span><h2 id="team-carousel-title">Gặp gỡ những người<br/>phía sau DolphinX.</h2></div><p>Những gương mặt quen, những góc nhìn mới. Cùng học hỏi, chia sẻ và kết nối qua từng hành trình.</p></div>
    <div className="ed-team-controls" aria-label="Điều khiển bộ chân dung">
      <span>{String(portraits.length).padStart(2, '0')} chân dung · Một tinh thần chung</span>
      <button type="button" aria-label="Xem chân dung trước" aria-controls="team-portrait-track" disabled={edges.start} onClick={() => move(-1)}><ArrowLeft size={22}/></button>
      <button type="button" aria-label="Xem chân dung tiếp theo" aria-controls="team-portrait-track" disabled={edges.end} onClick={() => move(1)}><ArrowRight size={22}/></button>
    </div>
    <div ref={track} id="team-portrait-track" className="ed-team-track" tabIndex={0} role="region" aria-label="Chân dung đội ngũ, dùng phím mũi tên hoặc vuốt để xem" onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
    }}>
      {portraits.map(([image, title, alt], index) => <figure key={image}>
        <div><Image src={`/brand/company/${image}`} alt={alt} width={1024} height={1536} sizes="(max-width:650px) 75vw, (max-width:1000px) 40vw, 300px"/></div>
        <figcaption><span>{String(index + 1).padStart(2, '0')} / DOLPHINX</span><h3>{title}</h3></figcaption>
      </figure>)}
    </div>
    <div className="ed-team-footer">
      <p className="ed-image-note">Ảnh do đội ngũ cung cấp; đồng phục và một số nền studio được chỉnh bằng AI.</p>
      {showDirectoryLink && <Link className="edu-link" href="/people">Gặp gỡ DolphinX <ArrowRight size={18}/></Link>}
    </div>
  </section>;
}
