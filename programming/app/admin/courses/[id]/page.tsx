import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMongoDatabase } from "@/lib/mongodb";
import type { Course } from "@/lib/types";
import CourseConfig from "../course-config";
import LessonForm from "../lesson-form";
export const dynamic = "force-dynamic";
export default async function CourseConfigPage({params}:{params:Promise<{id:string}>}) {
 if(!await isAdminAuthenticated()) redirect('/admin');
 const {id} = await params;
 if(id==='new') return <CourseConfig/>;
 const db = await getMongoDatabase();
 const document = await db.collection('courses').findOne({id});
 if(!document) notFound();
 const course = JSON.parse(JSON.stringify(document)) as Course;
 const lessons = await db.collection('video_lessons').find({courseId:id},{projection:{}}).sort({order:1,_id:1}).toArray();
 const chapters=[...new Set([...(course.modules??[]),...lessons.map(l=>String(l.module))])];
 return <CourseConfig course={course} lessonCount={lessons.length} publishedCount={lessons.filter(l=>l.published).length}>
  <details className="cc-add-lesson" open={!lessons.length}><summary>＋ Thêm bài giảng</summary><LessonForm label="Tạo bài giảng nháp" resetAfterSave><input type="hidden" name="action" value="lesson"/><input type="hidden" name="courseId" value={id}/><label>Tên bài giảng<input name="title" required maxLength={200}/></label><div className="cc-form-grid"><label>Chương<input name="module" list="course-modules" required maxLength={200}/><datalist id="course-modules">{course.modules?.map(m=><option key={m} value={m}/>)}</datalist></label><label>Thứ tự<input name="order" type="number" min={0} required defaultValue={lessons.length ? Math.max(...lessons.map(l=>Number(l.order)||0))+1 : 1}/></label></div><label>Video bài giảng (YouTube)<input name="video" type="url" placeholder="https://www.youtube.com/watch?v=…"/></label><label>Mục tiêu học tập<textarea name="objective" maxLength={3000}/></label><label>Bài tập & tiêu chí<textarea name="exercise" maxLength={5000}/></label><label className="cc-check"><input name="demo" type="checkbox"/>Video demo minh họa</label><p>Có thể tạo bài nháp trước khi có video. Để xuất bản, cần video, mục tiêu và bài tập.</p></LessonForm></details>
  <div className="cc-lessons">{!lessons.length&&<p>Chưa có bài giảng. Bắt đầu bằng chương đầu tiên của khóa học.</p>}{chapters.map(chapter=><section className="cc-chapter" key={chapter}><header><h3>{chapter}</h3><span>{lessons.filter(l=>l.module===chapter).length} bài</span></header>{!lessons.some(l=>l.module===chapter)&&<p className="cc-chapter-empty">Chưa có bài giảng trong chương này.</p>}{lessons.filter(l=>l.module===chapter).map(l=><article key={l._id.toString()}><div className="cc-lesson-heading"><div><span>{l.module} · Thứ tự {l.order}</span><h3>{l.title}</h3><small>{l.published?'Đã xuất bản':'Bản nháp'}{l.demo?' · Video demo':''}{!l.encryptedVideo?' · Chưa có video':''}</small></div><LessonForm label={l.published?'Ẩn bài':'Xuất bản'}><input type="hidden" name="action" value="publish"/><input type="hidden" name="id" value={l._id.toString()}/><input type="hidden" name="published" value={String(!l.published)}/></LessonForm></div><details><summary>Chỉnh sửa nội dung & video</summary><LessonForm label="Lưu bài giảng"><input type="hidden" name="action" value="editLesson"/><input type="hidden" name="id" value={l._id.toString()}/><label>Tên bài<input name="title" required maxLength={200} defaultValue={l.title}/></label><div className="cc-form-grid"><label>Chương<input name="module" required maxLength={200} defaultValue={l.module}/></label><label>Thứ tự<input name="order" type="number" min={0} required defaultValue={l.order}/></label></div><label>Video thay thế (để trống để giữ video hiện tại)<input name="video" type="url"/></label><label className="cc-check"><input name="demo" type="checkbox" defaultChecked={l.demo===true}/> Video demo minh họa</label><label>Mục tiêu<textarea name="objective" maxLength={3000} defaultValue={l.objective}/></label><label>Bài tập & tiêu chí<textarea name="exercise" maxLength={5000} defaultValue={l.exercise}/></label><label>Kế hoạch quay / giáo án<textarea name="recordingOutline" maxLength={8000} rows={5} defaultValue={l.recordingOutline}/></label></LessonForm></details></article>)}</section>)}</div>
 </CourseConfig>;
}
