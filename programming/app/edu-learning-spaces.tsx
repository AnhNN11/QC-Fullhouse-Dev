'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import './edu-learning-spaces.css';

const spaces = [
  { title:'Trao đổi cùng nhau', image:'/brand/company/presentation-original.png', text:'Mang theo một câu hỏi cụ thể, chia sẻ cách bạn đã thử và lắng nghe những hướng tiếp cận khác.', href:'/community', cta:'Mở cộng đồng học tập', note:'Ảnh gốc do đội ngũ cung cấp.' },
  { title:'Trình bày ý tưởng', image:'/brand/company/presentation-white-v1.png', text:'Giới thiệu vấn đề, demo một luồng chính và giải thích lựa chọn của bạn. Tìm phản hồi để biết điều gì nên cải thiện tiếp.', href:'/extracurriculars/demo-story', cta:'Khám phá cách trình bày dự án', note:'Ảnh đội ngũ cung cấp; đồng phục được chỉnh bằng AI.' },
  { title:'Thực hành độc lập', image:'/brand/company/course-coding-no-badge-v1.png', text:'Chọn một bài vừa sức, viết lời giải và chạy thử. Ghi lại lỗi, kiểm tra trường hợp biên rồi quay lại cải thiện.', href:'/dashboard#practice', cta:'Vào phòng luyện code', note:'Ảnh minh họa chỉnh AI từ chân dung đội ngũ.' },
  { title:'Tìm tài liệu phù hợp', image:'/brand/company/presentation-original.png', text:'Kết nối bài hướng dẫn với điều đang học. Đọc một phần nhỏ, thử ví dụ của riêng mình và ghi lại những điểm cần ôn.', href:'/resources', cta:'Khám phá thư viện', note:'Ảnh thuyết trình do đội ngũ cung cấp.' },
];

export default function EduLearningSpaces() {
  const [selected,setSelected]=useState(0);
  const space=spaces[selected];
  return <section className="ed-learning-spaces"><div className="edu-container"><div className="edu-section-head"><div><span className="edu-label">KHÔNG GIAN HỌC TẬP</span><h2>Có công cụ.<br/>Có cách học của bạn.</h2></div><p>Chọn cách thực hành phù hợp với điều đang học. Những không gian trực tuyến này luôn nằm trong cùng hệ sinh thái DolphinX.</p></div><div className="ed-space-options" role="group" aria-label="Chọn không gian học tập">{spaces.map((item,index)=><button key={item.title} type="button" aria-pressed={selected===index} aria-controls="ed-space-panel" onClick={()=>setSelected(index)}><span>0{index+1}</span>{item.title}<ArrowUpRight size={18}/></button>)}</div><div id="ed-space-panel" className="ed-space-panel"><Image key={space.image} src={space.image} alt={space.title} width={1536} height={1024} sizes="(max-width:750px) 90vw, 55vw"/><div><span className="edu-label">DOLPHINX / LEARNING SPACE 0{selected+1}</span><h3>{space.title}</h3><p>{space.text}</p><Link className="edu-link" href={space.href}>{space.cta} <ArrowUpRight size={19}/></Link><small>{space.note}</small></div></div></div></section>;
}
