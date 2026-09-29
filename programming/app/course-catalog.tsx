"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Layers3, Play } from "lucide-react";
import CourseCover from "./course-cover";
import type { Course } from "@/lib/types";
import "./course-catalog.css";
export default function CourseCatalog({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState(""), [level, setLevel] = useState("Tất cả");
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
  const filtered = courses.filter(course => (level === "Tất cả" || course.level === level) && normalize(`${course.title} ${course.description}`).includes(normalize(query)));
  return <section className="catalog-discover" id="catalog"><div className="catalog-heading"><div><span>CHỌN ĐIỂM XUẤT PHÁT</span><h2>Bạn muốn học gì hôm nay?</h2></div><label className="catalog-search"><Search size={17}/><input aria-label="Tìm trong thư viện khóa học" placeholder="Tìm khóa học…" value={query} onChange={event => setQuery(event.target.value)}/></label></div><div className="catalog-filters">{["Tất cả", ...new Set(courses.map(course => course.level))].map(value => <button key={value} aria-pressed={level === value} onClick={() => setLevel(value)}>{value}</button>)}<span role="status">{filtered.length} khóa học</span></div><div className="catalog-grid">{filtered.map(course => <Link href={`/courses/${encodeURIComponent(course.id)}`} className="catalog-card" key={course.id}><div className="catalog-image"><CourseCover course={course}/><span className="catalog-level">{course.level}</span><span className="catalog-play" aria-hidden="true"><Play size={18}/></span></div><div className="catalog-card-body"><div className="catalog-card-meta"><span>DOLPHINX CLASSROOM</span><span><Layers3 size={13}/>{course.modules.length} chương</span></div><h3>{course.title}</h3><p>{course.description}</p><div className="catalog-card-footer"><span>Khám phá giáo trình</span><ArrowUpRight size={18}/></div></div></Link>)}</div>{!filtered.length && <div className="catalog-empty"><h3>Chưa tìm thấy khóa học phù hợp</h3><p>Thử từ khóa khác hoặc xem toàn bộ thư viện.</p><button onClick={() => { setQuery(""); setLevel("Tất cả"); }}>Xóa bộ lọc</button></div>}</section>;
}
