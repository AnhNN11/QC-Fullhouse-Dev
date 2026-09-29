import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

function load(path, dependencies) {
  const exports = {};
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  vm.runInNewContext(code, { exports, Date, require(name) {
    if (name in dependencies) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  } });
  return exports;
}

const model = load('../lib/newsletter.ts', { 'node:crypto': { createHash } });
function harness({ admin = false, fail = false } = {}) {
  const records = new Map();
  const invalidations = [];
  let connections = 0;
  const actions = load('../app/newsletter/actions.ts', {
    'next/cache': { revalidatePath: path => invalidations.push(path) },
    '@/lib/newsletter': model,
    '@/lib/admin-auth': { isAdminAuthenticated: async () => admin },
    '@/lib/mongodb': { getMongoDatabase: async () => {
      connections++;
      if (fail) throw new Error('simulated unavailable database');
      return { collection(name) {
        assert.equal(name, 'newsletter_requests');
        return { async updateOne(filter, update, options) {
          const record = records.get(filter._id);
          if (!record && options?.upsert) records.set(filter._id, { _id: filter._id, ...update.$setOnInsert });
          if (record && update.$set) Object.assign(record, update.$set);
          return { matchedCount: record ? 1 : 0 };
        } };
      } };
    } },
  });
  return { ...actions, records, invalidations, connections: () => connections };
}
function form(values = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}
const valid = () => form({ email: '  Learner@Example.com ', consent: 'on' });

test('invalid email and missing consent never connect to storage', async () => {
  const h = harness();
  assert.ok((await h.requestNewsletter({}, form({ email: 'invalid', consent: 'on' }))).error);
  assert.ok((await h.requestNewsletter({}, form({ email: 'learner@example.com' }))).error);
  assert.equal(h.connections(), 0);
});
test('honeypot returns generic receipt without storing a subscriber', async () => {
  const h = harness(); const data = valid(); data.set('website', 'bot');
  assert.ok((await h.requestNewsletter({}, data)).success);
  assert.equal(h.connections(), 0);
});
test('normalized repeated requests insert only one record with consent provenance', async () => {
  const h = harness();
  assert.ok((await h.requestNewsletter({}, valid())).success);
  await h.requestNewsletter({}, valid());
  assert.equal(h.records.size, 1);
  const record = [...h.records.values()][0];
  assert.equal(record.email, 'learner@example.com');
  assert.equal(record.status, 'requested');
  assert.equal(record.consentVersion, 'newsletter-v1');
  assert.deepEqual(h.invalidations, ['/admin/newsletter', '/admin/newsletter']);
});
test('anonymous resubmission cannot reactivate a suppressed address', async () => {
  const h = harness({ admin: true });
  await h.requestNewsletter({}, valid());
  const id = [...h.records.keys()][0];
  assert.ok((await h.suppressNewsletter({}, form({ id }))).success);
  await h.requestNewsletter({}, valid());
  assert.equal(h.records.get(id).status, 'suppressed');
});
test('suppression requires admin and validates target existence', async () => {
  const denied = harness();
  assert.ok((await denied.suppressNewsletter({}, form({ id: 'a'.repeat(64) }))).error);
  assert.equal(denied.connections(), 0);
  const admin = harness({ admin: true });
  assert.ok((await admin.suppressNewsletter({}, form({ id: 'invalid' }))).error);
  assert.equal(admin.connections(), 0);
  assert.ok((await admin.suppressNewsletter({}, form({ id: 'a'.repeat(64) }))).error);
});
test('storage failures return errors, not false success', async () => {
  const h = harness({ fail: true, admin: true });
  assert.ok((await h.requestNewsletter({}, valid())).error);
  assert.ok((await h.suppressNewsletter({}, form({ id: 'a'.repeat(64) }))).error);
  assert.equal(h.invalidations.length, 0);
});
