/** Form parsing shared by lesson creation and editing; absent fields preserve old values. */
export function parseLessonFields(form: FormData, creating = false) {
 const output: Record<string, string | number | boolean> = {};
 for (const [key,max] of Object.entries({title:200,module:200,objective:3000,exercise:5000,recordingOutline:8000})) {
  if(!creating&&!form.has(key)) continue;
  const value=String(form.get(key)??'').trim();
  if(value.length>max || (['title','module'].includes(key)&&!value)) throw new Error(`Vui lòng kiểm tra ${key === 'title' ? 'tên bài giảng' : key === 'module' ? 'tên chương' : key}.`);
  output[key]=value;
 }
 if(creating||form.has('order')) {
  const raw=String(form.get('order')??'').trim();const order=Number(raw);
  if(!raw||!Number.isSafeInteger(order)||order<0) throw new Error('Thứ tự bài học phải là số nguyên không âm.');
  output.order=order;
 }
 output.demo=form.get('demo')==='on';
 return output;
}
export function lessonPublishError(lesson: { encryptedVideo?: unknown; objective?: unknown; exercise?: unknown }) {
 if(!lesson.encryptedVideo) return 'Thêm video trước khi xuất bản bài giảng.';
 if(typeof lesson.objective!=='string'||!lesson.objective.trim()) return 'Bổ sung mục tiêu học tập trước khi xuất bản.';
 if(typeof lesson.exercise!=='string'||!lesson.exercise.trim()) return 'Bổ sung bài tập và tiêu chí trước khi xuất bản.';
 return null;
}
