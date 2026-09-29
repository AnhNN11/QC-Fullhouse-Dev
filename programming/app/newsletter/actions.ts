'use server';

import { revalidatePath } from 'next/cache';
import { getMongoDatabase } from '@/lib/mongodb';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { newsletterEmail, newsletterId, type NewsletterRequest } from '@/lib/newsletter';
import type { ActionState } from '../academy/actions';

const received = { success: 'Đã ghi nhận yêu cầu nhận tin. Bạn có thể đọc các bài mới tại mục Blog trong thời gian chờ bản tin.' };

export async function requestNewsletter(_: ActionState, form: FormData): Promise<ActionState> {
  const email = newsletterEmail(form.get('email'));
  if (!email) return { error: 'Vui lòng nhập địa chỉ email hợp lệ.' };
  if (form.get('consent') !== 'on') return { error: 'Vui lòng xác nhận đồng ý nhận bản tin.' };
  if (form.get('website')) return received;
  try {
    const db = await getMongoDatabase();
    // Stable primary key makes concurrent/repeated submissions idempotent.
    // Never reactivate a suppressed address via an anonymous public form.
    const now = new Date();
    await db.collection<NewsletterRequest>('newsletter_requests').updateOne(
      { _id: newsletterId(email) },
      { $setOnInsert: { email, status: 'requested', createdAt: now, updatedAt: now, consentVersion: 'newsletter-v1' } },
      { upsert: true },
    );
    revalidatePath('/admin/newsletter');
    return received;
  } catch {
    return { error: 'Chưa lưu được yêu cầu. Bạn vui lòng thử lại sau.' };
  }
}

export async function suppressNewsletter(_: ActionState, form: FormData): Promise<ActionState> {
  if (!await isAdminAuthenticated()) return { error: 'Vui lòng đăng nhập admin.' };
  const id = String(form.get('id') ?? '');
  if (!/^[a-f0-9]{64}$/.test(id)) return { error: 'Yêu cầu không hợp lệ.' };
  try {
    const db = await getMongoDatabase();
    const result = await db.collection<NewsletterRequest>('newsletter_requests').updateOne(
      { _id: id }, { $set: { status: 'suppressed', updatedAt: new Date() } },
    );
    if (!result.matchedCount) return { error: 'Không tìm thấy yêu cầu.' };
    revalidatePath('/admin/newsletter');
    return { success: 'Đã đưa địa chỉ vào danh sách không gửi tin.' };
  } catch { return { error: 'Chưa cập nhật được. Vui lòng thử lại.' }; }
}
