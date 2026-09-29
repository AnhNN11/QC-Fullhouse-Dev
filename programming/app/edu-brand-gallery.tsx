'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Expand, X, ZoomIn, ZoomOut } from 'lucide-react';
import './edu-brand-gallery.css';

const items = [
  { image: 'welcome-kit.png', title: 'Welcome kit / Những chi tiết tạo nên sự gắn kết', alt: 'Bản thiết kế bộ vật phẩm DolphinX màu navy với logo xanh cyan', description: 'Trong bản thiết kế: hộp quà, bình nước, dây đeo và thẻ nhân viên, sổ tay, bút bi, cáp sạc, bảng tên và sticker.' },
  { image: 'uniform-reference.png', title: 'Đồng phục / Navy & White', alt: 'Hai phiên bản đồng phục DolphinX navy và trắng, viền xanh cyan', description: 'Hai phiên bản polo navy và trắng, cùng viền cyan ở cổ và tay áo. Logo DolphinX phía trước, thông điệp “Innovation Drives Us Forward.” phía sau.' },
];

export default function EduBrandGallery() {
  const modal = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const item = items[selected];
  return <>
    <div className="ed-brand-gallery">{items.map((entry, index) => <figure key={entry.image}>
      <button type="button" className="ed-brand-preview" aria-label={`Phóng to: ${entry.title}`} onClick={event => {
        trigger.current = event.currentTarget;
        setSelected(index);
        setZoomed(false);
        modal.current?.showModal();
      }}>
        <Image src={`/brand/company/${entry.image}`} alt={entry.alt} width={1536} height={1024} sizes="(max-width:800px) 90vw, 60vw"/>
        <span><Expand size={18}/> Xem chi tiết</span>
      </button>
      <figcaption><span>{entry.title}</span><p className="ed-brand-description">{entry.description}</p></figcaption>
    </figure>)}</div>
    <dialog className="ed-brand-modal" ref={modal} aria-labelledby="brand-preview-title" onClose={() => trigger.current?.focus()} onClick={event => {
      if (event.target === event.currentTarget) modal.current?.close();
    }} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <header><h2 id="brand-preview-title">{item.title}</h2><div className="ed-brand-modal-tools"><button type="button" aria-label="Phóng to chi tiết" aria-pressed={zoomed} aria-controls="brand-image-viewport" onClick={() => setZoomed(value => !value)}>{zoomed ? <ZoomOut size={22}/> : <ZoomIn size={22}/>}</button><button type="button" autoFocus onClick={() => modal.current?.close()} aria-label="Đóng bản thiết kế"><X size={24}/></button></div></header>
      <div id="brand-image-viewport" className={`ed-brand-image-viewport${zoomed ? ' is-zoomed' : ''}`} tabIndex={zoomed ? 0 : undefined} role="region" aria-label="Bản thiết kế; khi phóng to có thể cuộn để xem chi tiết">
        <Image src={`/brand/company/${item.image}`} alt={item.alt} width={1536} height={1024} sizes={zoomed ? '1536px' : '95vw'}/>
      </div>
      <footer><p>Bản thiết kế gốc do công ty cung cấp.</p><a href={`/brand/company/${item.image}`} target="_blank" rel="noopener noreferrer">Mở ảnh gốc trong tab mới ↗</a></footer>
    </dialog>
  </>;
}
