// Real Mongo writes are restricted to a disposable test database.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { randomBytes } from 'node:crypto';
import { MongoClient } from 'mongodb';
import nextEnv from '@next/env';
import ts from 'typescript';
nextEnv.loadEnvConfig(process.cwd());
const name = `codex_enroll_test_${randomBytes(8).toString('hex')}`;
const client = await new MongoClient(process.env.MONGODB_URI).connect();
const db = client.db(name);
let user = null, admin = false;
const exports = {};
const enrollmentKey = (userId, courseId) => JSON.stringify([userId, courseId]);
vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/enrollment-actions.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  exports, Date, require: id => {
    if (id === 'next/cache') return { revalidatePath() {} };
    if (id === 'next/navigation') return { redirect(url) { throw new Error(`REDIRECT:${url}`); } };
    if (id === '@/lib/mongodb') return { getMongoDatabase: async () => db };
    if (id === '@/lib/user-auth') return { getSessionUser: async () => user };
    if (id === '@/lib/admin-auth') return { isAdminAuthenticated: async () => admin };
    if (id === '@/lib/enrollment') return { enrollmentKey };
    throw new Error(id);
  },
});
const form = values => { const f = new FormData(); Object.entries(values).forEach(([k,v]) => f.set(k,v)); return f; };
try {
  await db.collection('courses').insertOne({ id: 'test' });
  const input = form({ courseId: 'test' });
  assert.ok((await exports.enrollCourse({}, input)).error);
  user = { id: 'alpha' };
  assert.ok((await exports.enrollCourse({}, form({ courseId: 'missing' }))).error);
  assert.ok((await exports.enrollCourse({}, input)).error);
  await db.collection('video_lessons').insertOne({ courseId: 'test', published: true });
  const attempt = () => assert.rejects(exports.enrollCourse({}, input), /REDIRECT:\/courses\/test\/learn/);
  await Promise.all([attempt(), attempt(), attempt()]);
  assert.equal(await db.collection('course_enrollments').countDocuments(), 1);
  assert.equal(await db.collection('course_access').countDocuments(), 0);
  const id = enrollmentKey(user.id, 'test');
  assert.ok((await exports.manageEnrollment({}, form({ id, status: 'revoked' }))).error);
  admin = true;
  assert.ok((await exports.manageEnrollment({}, form({ id, status: 'revoked' }))).success);
  assert.ok((await exports.enrollCourse({}, input)).error);
  assert.equal((await db.collection('course_enrollments').findOne({ _id: id })).status, 'revoked');
  assert.ok((await exports.manageEnrollment({}, form({ id, status: 'active' }))).success);
  await attempt();
  user = { id: 'beta' }; await attempt();
  assert.equal(await db.collection('course_enrollments').countDocuments(), 2);
  console.log('PASS: authentication, invalid/empty course, concurrent idempotency, no video grant, admin-only revoke/restore, revoked cannot self-enroll, separate users.');
} finally {
  if (!/^codex_enroll_test_[a-f0-9]{16}$/.test(name)) throw new Error('Unsafe cleanup');
  await db.dropDatabase(); await client.close();
  console.log('Removed disposable test database; application data untouched.');
}
