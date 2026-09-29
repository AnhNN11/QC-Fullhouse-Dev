"use client";
import { useState } from "react";
import { Code2 } from "lucide-react";
import type { Course } from "@/lib/types";
import { courseLevels, courseColors, normalizeCourseLevel, courseLevelTone } from "@/lib/course-options";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string | number; type?: string; required?: boolean }) {
  return <div className="grid gap-2"><Label htmlFor={`admin-${name}`}>{label}</Label><Input id={`admin-${name}`} name={name} defaultValue={defaultValue} type={type} min={type === "number" ? (name === "level" ? 1 : 0) : undefined} required={required} /></div>;
}

export default function CourseFields({ course }: { course?: Course }) {
  const [level,setLevel] = useState(normalizeCourseLevel(course?.level ?? "Cơ bản"));
  const [color,setColor] = useState(course?.color ?? "blue");
  const [title,setTitle] = useState(course?.title ?? "");
  return <div className="mg-course-editor">
    <section><h3>01 · Thông tin khóa học</h3><p>Giới thiệu rõ nội dung và đối tượng phù hợp.</p>
      <Label htmlFor="course-title">Tên khóa học *</Label><Input id="course-title" name="title" required maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ví dụ: Python cho người mới bắt đầu"/>
      <Label htmlFor="admin-description">Mô tả khóa học *</Label><Textarea id="admin-description" name="description" required maxLength={3000} rows={3} defaultValue={course?.description} placeholder="Học viên sẽ học gì và thực hành như thế nào?"/>
      <Label htmlFor="admin-audience">Dành cho ai?</Label><Textarea id="admin-audience" name="audience" maxLength={2000} defaultValue={course?.audience} placeholder="Ví dụ: Học sinh THCS, chưa cần kiến thức lập trình"/>
    </section>
    <section><h3>02 · Cấp độ & nhận diện</h3><p>Cấp độ thể hiện yêu cầu đầu vào. Màu nhận diện được chọn riêng.</p>
      <fieldset className="mg-level-options"><legend>Cấp độ khóa học</legend>{courseLevels.map(item=><label key={item.value} className={`mg-level-choice mg-level-${item.tone}`}><input type="radio" name="level" value={item.value} checked={level===item.value} onChange={()=>setLevel(item.value)}/><span><strong>{item.value}</strong><small>{item.description}</small></span></label>)}{!courseLevels.some(item=>item.value===level)&&<label><input type="radio" name="level" value={level} checked readOnly/> {level} (giá trị hiện có)</label>}</fieldset>
      <fieldset className="mg-color-options"><legend>Màu nhận diện</legend>{courseColors.map(item=><label key={item.value} title={item.label}><input type="radio" name="color" value={item.value} checked={color===item.value} onChange={()=>setColor(item.value)}/><i style={{background:item.hex}}/><span>{item.label}</span></label>)}</fieldset>
      <div className="mg-course-preview" style={{borderLeftColor:courseColors.find(item=>item.value===color)?.hex}}><Code2/><div><small>XEM TRƯỚC THẺ QUẢN TRỊ</small><strong>{title || "Tên khóa học của bạn"}</strong><span className={`mg-level mg-level-${courseLevelTone(level)}`}>{level}</span></div></div>
      <Field label="Biểu tượng dạng chữ" name="icon" defaultValue={course?.icon ?? "</>"}/>
    </section>
    <section><h3>03 · Chương trình & kết quả</h3><p>Mỗi dòng là một mục. Thêm video từng bài tại phần Bài giảng bên dưới sau khi lưu khóa học.</p>
      <Label htmlFor="admin-outcomes">Học xong làm được gì?</Label><Textarea id="admin-outcomes" name="outcomes" rows={4} defaultValue={course?.outcomes?.join("\n")} placeholder="Viết chương trình Python đầu tiên&#10;Hoàn thành một dự án nhỏ"/>
      <Label htmlFor="admin-prerequisites">Kiến thức & thiết bị cần chuẩn bị</Label><Textarea id="admin-prerequisites" name="prerequisites" rows={3} defaultValue={course?.prerequisites?.join("\n")} placeholder="Máy tính có kết nối Internet"/>
      <Label htmlFor="admin-modules">Danh sách chương dự kiến</Label><Textarea id="admin-modules" name="modules" rows={5} defaultValue={course?.modules.join("\n")}/>
      <Field label="Số bài học dự kiến" name="lessons" type="number" defaultValue={course?.lessons ?? 0}/>
    </section>
    <section><h3>04 · Video giới thiệu</h3><Field label="Link YouTube công khai (không bắt buộc)" name="introVideoUrl" type="url" defaultValue={course?.introVideoUrl ?? ""}/><p>Video này hiển thị trên trang giới thiệu khóa học.</p></section>
    <input type="hidden" name="students" value={course?.students ?? "0"}/>
  </div>;
}
