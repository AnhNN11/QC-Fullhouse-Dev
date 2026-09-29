'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from 'lucide-react';
import './edu-gallery.css';

const slides = [
{ image: 'team-collaboration-no-badge-v3.png', title: 'Một đội ngũ. Nhiều góc nhìn.', label: 'CÙNG LÀM ĐIỀU CÓ Ý NGHĨA', text: 'Mỗi ý tưởng được làm rõ hơn khi cùng trao đổi. Tinh thần học hỏi và hợp tác kết nối những cá tính trong DolphinX.', note: 'Ảnh tập thể ghép bằng AI từ chân dung do đội ngũ cung cấp; bối cảnh minh họa.', href: '/people', cta: 'Gặp gỡ đội ngũ', position: 'center' },
  { image: 'team-studio-no-badge-v3.png', title: 'Cùng nhau, cùng tiến bộ', label: 'CON NGƯỜI DOLPHINX', text: 'Kết nối những góc nhìn khác nhau qua tinh thần học hỏi, sáng tạo và chia sẻ mỗi ngày.', note: 'Ảnh tập thể studio ghép bằng AI từ chân dung do đội ngũ cung cấp.', href: '/people', cta: 'Khám phá các gương mặt', position: 'center' },

  { image: 'presentation-white-v1.png', title: 'Để ý tưởng được lắng nghe', label: 'TRÌNH BÀY & PHẢN HỒI', text: 'Kể câu chuyện phía sau sản phẩm: vấn đề cần giải, lựa chọn đã làm và điều muốn cải thiện.', note: 'Ảnh đội ngũ cung cấp; đồng phục được chỉnh bằng AI.', href: '/extracurriculars/demo-story', cta: 'Thử trình bày dự án', position: '65% center' },
  { image: 'representative-navy-v1.png', title: 'Nét riêng trong một tập thể', label: 'CON NGƯỜI DOLPHINX', text: 'Những gương mặt thật, những cá tính riêng. Khám phá các khoảnh khắc của đội ngũ phía sau DolphinX.', note: 'Chân dung gốc của đội ngũ; đồng phục được chỉnh bằng AI.', href: '/people', cta: 'Gặp gỡ DolphinX', position: 'center 25%' },
];

export default function EduGallery() {
  const [index, setIndex] = useState(0);
  const modal = useRef<HTMLDialogElement>(null);
  const slide = slides[index];
  const move = (direction: number) => setIndex(current => (current + direction + slides.length) % slides.length);
  return <section className="edu-section edu-container ed-gallery-section" aria-labelledby="gallery-heading" data-reveal>
    <div className="edu-section-head"><div><span className="edu-label">KHOẢNH KHẮC & KẾT NỐI</span><h2 id="gallery-heading">Học hỏi ở mọi nơi.<br/><span>Trưởng thành cùng nhau.</span></h2></div><Link className="edu-link" href="/extracurriculars">Khám phá các hoạt động <ArrowUpRight size={18}/></Link></div>
    <div className="ed-gallery" role="region" aria-roledescription="bộ ảnh" aria-label="Khoảnh khắc DolphinX">
      <div className="ed-gallery-photo"><Image key={slide.image} src={`/brand/company/${slide.image}`} alt={slide.title} width={1536} height={1024} sizes="(max-width:750px) 90vw, 60vw" style={{objectPosition:slide.position}}/><button type="button" className="ed-gallery-expand" onClick={()=>modal.current?.showModal()} aria-label={`Phóng to ảnh: ${slide.title}`}><Expand size={20}/></button></div>
      <div className="ed-gallery-copy"><span className="edu-label">{slide.label}</span><h3>{slide.title}</h3><p>{slide.text}</p><Link href={slide.href} className="edu-link">{slide.cta} <ArrowUpRight size={18}/></Link><small>{slide.note}</small><div className="ed-gallery-controls"><span role="status" aria-live="polite">{index+1} / {slides.length}</span><div><button type="button" onClick={()=>move(-1)} aria-label="Ảnh trước"><ArrowLeft size={21}/></button><button type="button" onClick={()=>move(1)} aria-label="Ảnh tiếp theo"><ArrowRight size={21}/></button></div></div></div>
    </div>
    <div className="ed-gallery-thumbs" aria-label="Chọn ảnh">{slides.map((item,i)=><button type="button" key={item.image} onClick={()=>setIndex(i)} aria-label={`Ảnh ${i+1}: ${item.title}`} aria-pressed={index===i}><Image src={`/brand/company/${item.image}`} alt="" width={200} height={130} sizes="(max-width:750px) 20vw, 130px"/><span>0{i+1}</span></button>)}</div>
    <dialog ref={modal} className="ed-gallery-modal" aria-labelledby="gallery-modal-title" onKeyDown={event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();move(1);}
      if(event.key==='Tab'){
        const buttons=event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
        const first=buttons[0],last=buttons[buttons.length-1];
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    }}>
      <button type="button" className="ed-gallery-close" autoFocus onClick={()=>modal.current?.close()} aria-label="Đóng ảnh phóng to"><X size={24}/></button>
      <Image src={`/brand/company/${slide.image}`} alt={slide.title} width={1536} height={1024} sizes="95vw"/>
      <div className="ed-gallery-modal-caption"><div><h2 id="gallery-modal-title">{slide.title}</h2><p>{slide.note}</p></div><div className="ed-gallery-modal-controls"><button type="button" onClick={()=>move(-1)} aria-label="Ảnh trước trong cửa sổ phóng to"><ArrowLeft/></button><span aria-live="polite">{index+1} / {slides.length}</span><button type="button" onClick={()=>move(1)} aria-label="Ảnh tiếp theo trong cửa sổ phóng to"><ArrowRight/></button></div></div>
    </dialog>
  </section>;
}
