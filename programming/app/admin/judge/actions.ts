"use server";
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getMongoDatabase } from '@/lib/mongodb';
import { importExpandedProblems } from '@/lib/import-expanded-problems';
import { grade, validateTests } from '@/lib/grading';
import { gradedProblems, teachingTracks } from '@/lib/teaching-seed';
import { encryptVideo } from '@/lib/video-security';
import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/app/academy/actions';

export async function manageTeaching(_: ActionState, form: FormData): Promise<ActionState> {
  if (!await isAdminAuthenticated()) return { error: 'Vui lòng đăng nhập admin.' };
  try {
    const db = await getMongoDatabase();
    if (form.get('action') === 'expand') {
      await importExpandedProblems();
    } else if (form.get('action') === 'disable') {
      await db.collection('judge_configs').updateOne({ problemId: Number(form.get('problemId')) }, { $set: { enabled: false, updatedAt: new Date() } });
    } else if (form.get('action') === 'seed') {
      for (const p of gradedProblems) {
        if (!(await grade(p.reference, p.tests)).accepted) throw new Error('Bộ test mẫu chưa hợp lệ.');
        await db.collection('judge_configs').updateOne({ problemId: p.id }, { $setOnInsert: { problemId: p.id, tests: p.tests, reference: p.reference, enabled: true, updatedAt: new Date() } }, { upsert: true });
        // Upgrade only the original placeholder/seed wording, never overwrite authored problems.
        await db.collection('problems').updateOne({ id: p.id, $or: [{ statement: /^Hoàn thành hàm solve/ }, { statement: /^Cho một mảng số nguyên nums/ }] }, { $set: { statement: p.statement, starterCode: p.starterCode, exampleInput: p.exampleInput, exampleOutput: p.exampleOutput, explanation: 'Đầu vào là các tham số của solve; trả về kết quả, không dùng console.log.', constraints: p.constraints } });
      }
      for (const track of teachingTracks) {
        if (!await db.collection('courses').findOne({ id: track.id })) continue;
        for (const [index, [title, objective, exercise]] of track.lessons.entries()) {
          await db.collection('video_lessons').updateOne({ seedKey: `curriculum-v1:${track.id}:${index}` }, { $setOnInsert: { seedKey: `curriculum-v1:${track.id}:${index}`, courseId: track.id, title, module: `Nền tảng · Bài ${index + 1}`, order: index + 1, objective, exercise, prerequisite: track.prerequisite, resource: track.resource, recordingOutline: `0–2 phút: nêu vấn đề và đầu ra mong muốn.\n2–6 phút: ${objective}\n6–12 phút: live-code ví dụ trong bài tập: ${exercise}\n12–15 phút: thử đầu vào biên và sửa một lỗi thường gặp.\n15–18 phút: tóm tắt, giao bài và đối chiếu tiêu chí trong đề.\nThời lượng là kế hoạch quay, không phải thời lượng video demo.`, encryptedVideo: encryptVideo('https://www.youtube.com/watch?v=M7lc1UVf-VE'), demo: true, published: true, createdAt: new Date() } }, { upsert: true });
        }
        const count = await db.collection('video_lessons').countDocuments({ courseId: track.id, published: true });
        await db.collection('courses').updateOne({ id: track.id }, { $set: { lessons: count } });
      }
      await db.collection('courses').updateOne({ id: 'python', description: 'Làm chủ Python qua 20 dự án và hơn 100 bài luyện code.' }, { $set: { description: '5 bài nền tảng và mini project sổ chi tiêu. Giáo án sẵn có; video đang ở chế độ demo.' } });
      await db.collection('courses').updateOne({ id: 'interview', description: '150 bài trọng tâm, mock interview và chiến thuật giải bài.' }, { $set: { description: '5 bài khởi đầu về tư duy phỏng vấn, thuật toán và tự đánh giá. Video demo.' } });
    } else {
      const problemId = Number(form.get('problemId'));
      if (!await db.collection('problems').findOne({ id: problemId })) throw new Error('Bài tập không tồn tại.');
      const tests = validateTests(JSON.parse(String(form.get('tests'))));
      const reference = String(form.get('reference') ?? '');
      if (!reference || reference.length > 20_000) throw new Error('Lời giải chuẩn cần 1–20000 ký tự.');
      if (!(await grade(reference, tests)).accepted) throw new Error('Lời giải chuẩn không qua tất cả test. Chưa lưu.');
      await db.collection('judge_configs').updateOne({ problemId }, { $set: { tests, reference, enabled: form.get('enabled') === 'on', updatedAt: new Date() } }, { upsert: true });
    }
    for (const route of ['/dashboard', '/courses', '/admin/judge', '/admin/academy']) revalidatePath(route);
    return { success: 'Đã lưu. Nội dung mẫu được nhập theo khóa ổn định, không tạo trùng khi bấm lại.' };
  } catch (error) { return { error: error instanceof Error ? error.message : 'Chưa thể lưu.' }; }
}
