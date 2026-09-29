"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Save, Video, BookOpen, Settings2, ExternalLink } from "lucide-react";
import type { Course } from "@/lib/types";
import CourseFields from "../course-fields";
import CourseIntro from "@/app/course-intro";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import "../management.css";
import "@/app/course-detail.css";
import "./course-config.css";

export default function CourseConfig({ course, children, lessonCount = 0, publishedCount = 0 }: { course?: Course; children?: ReactNode; lessonCount?: number; publishedCount?: number }) {
 const router = useRouter();
 const [saving,setSaving] = useState(false);
 const [error,setError] = useState("");
 const [saved,setSaved] = useState(false);
 async function save(form: FormData) {
  setSaving(true); setError(""); setSaved(false);
  const lines = (name:string) => String(form.get(name)??"").split("\n").map(v=>v.trim()).filter(Boolean);
  try {
   const response = await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'saveCourse',payload:{id:course?.id,title:form.get('title'),description:form.get('description'),audience:form.get('audience'),level:form.get('level'),color:form.get('color'),icon:form.get('icon'),students:form.get('students'),lessons:Number(form.get('lessons')),introVideoUrl:form.get('introVideoUrl'),modules:lines('modules'),outcomes:lines('outcomes'),prerequisites:lines('prerequisites')}})});
   const result = await response.json();
   if(!response.ok) throw new Error(result.error || 'Không lưu được khóa học.');
   if(!course) router.replace(`/admin/courses/${encodeURIComponent(result.courseId)}`);
   else {setSaved(true);router.refresh();}
  } catch(e) {setError(e instanceof Error?e.message:'Không thể kết nối. Vui lòng thử lại.');}
  finally {setSaving(false);}
 }
 return <main className="cc-page"><header className="cc-header"><Link href="/admin"><ArrowLeft size={16}/> Quản trị khóa học</Link><span>DOLPHINX EDUCATION</span></header><div className="cc-heading"><div><p>KHÔNG GIAN BIÊN SOẠN</p><h1>{course ? course.title : 'Tạo khóa học mới'}</h1><span>{course ? 'Quản lý giới thiệu, chương trình và video bài giảng trong một trang.' : 'Khởi tạo thông tin và video giới thiệu. Sau khi lưu, bạn sẽ vào trang cấu hình để thêm bài giảng.'}</span></div>{course && <Link className="cc-view" href={`/courses/${encodeURIComponent(course.id)}`} target="_blank">Xem trang học viên <ExternalLink size={15}/></Link>}</div>
 <div className="cc-layout"><aside className="cc-sidebar"><nav aria-label="Cấu hình khóa học"><a href="#course-information"><Settings2 size={18}/>Thông tin khóa học</a><a href="#course-preview"><Video size={18}/>Video giới thiệu</a>{course&&<a href="#course-lessons"><BookOpen size={18}/>Bài giảng <b>{lessonCount}</b></a>}</nav><div><strong>Trước khi giới thiệu khóa học</strong><p>1. Hoàn thiện nội dung</p><p>2. Thêm video demo giới thiệu</p><p>3. Thêm và xuất bản bài giảng</p></div></aside>
 <div className="cc-content"><section className="cc-panel" id="course-preview"><div className="cc-section-heading"><div><h2>Video demo giới thiệu khóa học</h2><p>{course?.introVideoUrl ? 'Video đã lưu, hiển thị trên trang giới thiệu công khai.' : 'Thêm link YouTube ở mục Video giới thiệu trong form bên dưới rồi lưu để xem trước.'}</p></div><Video size={22}/></div><div className="cc-video"><CourseIntro key={course?.introVideoUrl ?? 'empty'} id={course?.id??'new'} title={course?.title??'Khóa học mới'} url={course?.introVideoUrl}/><div><span className="cc-label">GIỚI THIỆU KHÓA HỌC</span><h3>{course?.title??'Bước đầu tiên của hành trình học'}</h3><p>{course?.description??'Video giúp học viên hiểu khóa học dành cho ai, học được gì và sẽ thực hành như thế nào.'}</p>{course&&<p>{lessonCount} bài giảng · {publishedCount} đã xuất bản</p>}</div></div></section>
 <section className="cc-panel" id="course-information"><div className="cc-section-heading"><div><h2>Thông tin & chương trình</h2><p>Lưu thông tin trước khi thêm hoặc cập nhật bài giảng.</p></div></div><form onSubmit={e=>{e.preventDefault();void save(new FormData(e.currentTarget));}}><fieldset disabled={saving} className="mg-editor-fields"><CourseFields course={course}/></fieldset><div className="cc-save"><div aria-live="polite">{error&&<p role="alert" className="cc-error">{error}</p>}{saved&&<p className="cc-success"><Check size={16}/>Đã lưu cấu hình khóa học.</p>}</div><Button disabled={saving} type="submit"><Save size={16}/>{saving?'Đang lưu…':course?'Lưu cấu hình':'Tạo khóa học & tiếp tục'}</Button></div></form></section>
 {course&&<section className="cc-panel" id="course-lessons"><div className="cc-section-heading"><div><h2>Bài giảng & video</h2><p>Thêm bài vào từng chương, hoàn thiện giáo án rồi xuất bản.</p></div><BookOpen size={22}/></div>{children}</section>}</div></div></main>;
}
