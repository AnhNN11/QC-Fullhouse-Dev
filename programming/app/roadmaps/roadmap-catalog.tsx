"use client";
import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { type RoadmapGuide } from '@/lib/roadmap-guides';
import './roadmap-detail.css';
import { ArrowUpRight, Search, Route } from "lucide-react";
import { type LearningRoadmap, roadmapNodes } from "@/lib/roadmaps";
export default function RoadmapCatalog({ roadmaps, guides: roadmapGuides }: { roadmaps: LearningRoadmap[]; guides: Record<string, RoadmapGuide> }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().trim();
  const items = roadmaps.filter(item => (category === "Tất cả" || item.category === category) && normalize(item.title + item.description + roadmapGuides[item.slug].audience).includes(normalize(query)));
  return <div className="rm-container rm-studio"><section className="rm-intro rm-catalog-hero"><div><span className="rm-eyebrow"><Route/> BẢN ĐỒ HỌC TẬP MỞ</span><h1>Một hướng đi.<br/><em>Nhiều khả năng.</em></h1><p>Không cần đăng nhập để khám phá. Mỗi lộ trình đi từ nền tảng đến dự án, kèm tài liệu và tiêu chí tự kiểm tra.</p><label className="rm-search"><Search/><input aria-label="Tìm lộ trình" placeholder="Bạn muốn học điều gì?" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><Image src="/brand/roadmap-navigator-v1.png" alt="Cá heo dẫn đường qua các đảo kiến thức" width={1536} height={1024} sizes="(max-width:800px) 90vw, 40vw"/></section><div className="rm-how"><span><b>01</b> Chọn mục tiêu</span><span><b>02</b> Khám phá từng chủ đề</span><span><b>03</b> Thực hành & tự kiểm tra</span></div>
    <div className="rm-categories" aria-label="Lọc lộ trình">{["Tất cả","Theo vai trò","Theo kỹ năng"].map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}<span aria-live="polite">{items.length} lộ trình</span></div>
    <div className="rm-catalog">{items.map(item=><Link href={`/roadmaps/${item.slug}`} key={item.slug} className="rm-card"><div><span className="rm-symbol">{item.symbol}</span><ArrowUpRight/></div><small>{item.category}</small><h2>{item.title}</h2><p>{item.description}</p><footer><span>{item.stages.length} chặng · {roadmapNodes(item).length} chủ đề</span><span>Xem lộ trình →</span></footer></Link>)}</div>
    {!items.length && <p role="status" className="rm-empty">Chưa tìm thấy lộ trình. Thử từ khóa khác hoặc chọn “Tất cả”.</p>}
    <section className="rm-help"><Route/><div><h2>Mỗi người có một điểm xuất phát.</h2><p>Cần điều chỉnh lộ trình theo mục tiêu cá nhân? Cùng trao đổi với đội ngũ tư vấn.</p></div><Link href="/consultation">Tư vấn 1:1 <ArrowUpRight/></Link></section>
  </div>;
}
