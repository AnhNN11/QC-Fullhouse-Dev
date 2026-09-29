import 'server-only';
import { spawn } from 'node:child_process';
import path from 'node:path';
import type { SubmissionResult } from './types';

export type JudgeTest = { args: unknown[]; expected: unknown; sample: boolean };
export function validateTests(value: unknown): JudgeTest[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 30 || JSON.stringify(value).length > 50_000) throw new Error('Cần 2–30 test, tối đa 50 KB.');
  if (value.some(t => !t || !Array.isArray(t.args) || !Object.hasOwn(t, 'expected') || typeof t.sample !== 'boolean')) throw new Error('Test cần args (mảng tham số), expected và sample (boolean).');
  if (!value.some(t => t.sample) || !value.some(t => !t.sample)) throw new Error('Cần ít nhất một test mẫu và một test ẩn.');
  return value;
}
let active = 0;
export async function grade(code: string, tests: JudgeTest[]): Promise<SubmissionResult> {
  if (active >= 2) throw new Error('Máy chấm đang bận. Vui lòng thử lại.');
  active++;
  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['--max-old-space-size=64', path.join(process.cwd(), 'scripts/judge-worker.mjs')], { env: { NODE_ENV: 'production' }, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
      let settled = false;
      const finish = (result?: SubmissionResult) => { if (settled) return; settled = true; clearTimeout(timer); child.kill('SIGKILL'); if (result) resolve(result); else reject(new Error('Máy chấm không phản hồi hoặc vượt giới hạn tài nguyên.')); };
      const timer = setTimeout(() => finish(), 10_000);
      child.once('message', result => finish(result as SubmissionResult));
      child.once('error', () => finish());
      child.once('exit', () => finish());
      child.send({ code, tests });
    });
  } finally { active--; }
}
