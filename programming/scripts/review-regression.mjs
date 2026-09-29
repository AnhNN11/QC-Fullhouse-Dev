import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { ObjectId } from 'mongodb';

function load(file, dependencies, globals = {}) {
  const context = { exports: {}, ...globals, require: name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText, context);
  return context.exports;
}
const id = new ObjectId();
const account = { _id: id, name: 'Test Learner', email: 'learner@example.test', xp: 30, level: 2 };
const writes = [];
const queries = [];
const db = { collection(name) {
  assert.notEqual(name, 'learners', 'Never read or edit demo learners');
  return {
    async findOne() { return name === 'app_meta' ? { seeded: true } : null; },
    find(filter, options) {
      queries.push({ name, options });
      const rows = name === 'users' ? [account] : name === 'submissions' ? [{ _id: new ObjectId(), learnerId: id.toString(), problemId: 1, language: 'javascript', accepted: true, runtimeMs: 1, createdAt: new Date() }] : [];
      return { sort() { return this; }, limit() { return this; }, async toArray() { return rows; } };
    },
    async updateOne(filter, update) { writes.push({ name, filter, update }); return { matchedCount: filter._id.equals(id) ? 1 : 0 }; },
  };
} };
const activity = { activitySummary: () => ({ streak: 0, bestStreak: 0, today: '', learningDays: [], weeklyActivity: [] }) };
const data = load('lib/db.ts', { 'server-only': {}, './content': {}, './mongodb': { getMongoDatabase: async () => db }, './user-auth': { getSessionUser: async () => null }, mongodb: { ObjectId }, './activity': activity, './record-activity': {} });
const admin = await data.getAdminData();
assert.equal(admin.learners[0].id, id.toString());
assert.equal(admin.learners[0].email, account.email);
assert.equal(admin.submissions[0].learnerName, account.name);
assert.equal(admin.stats.learners, 1);
assert.equal(queries.find(q => q.name === 'users').options.projection.email, 1);
await data.updateAdminLearner(id.toString(), { name: 'Updated', level: 3, xp: 60 });
assert.equal(writes[0].name, 'users');
assert.equal(writes[0].update.$set.xp, 60);
assert.equal('streak' in writes[0].update.$set, false);
await assert.rejects(() => data.updateAdminLearner('1', { name: 'X', level: 1, xp: 0 }));
await assert.rejects(() => data.updateAdminLearner(id.toString(), { name: 'X', level: 1, xp: -1 }));
await assert.rejects(() => data.updateAdminLearner(new ObjectId().toString(), { name: 'X', level: 1, xp: 0 }));

const listeners = {};
const window = { location: { hash: '' }, history: {
  pushState(_state, _unused, url) { window.location.hash = new URL(url, 'http://localhost').hash; },
  replaceState(_state, _unused, url) { window.location.hash = new URL(url, 'http://localhost').hash; },
}, addEventListener: (key, fn) => { listeners[key] = fn; }, removeEventListener: key => { delete listeners[key]; } };
const nav = load('app/navigation-location.ts', {}, { window });
let notifications = 0;
const originalPush = window.history.pushState;
const unsubscribe = nav.subscribeLocation(() => notifications++);
window.history.pushState({}, '', '/dashboard#practice');
assert.equal(notifications, 1);
assert.equal(nav.isLearningLinkActive('/dashboard#practice', '/dashboard', nav.getLocationHash()), true);
assert.equal(nav.isLearningLinkActive('/dashboard', '/dashboard', nav.getLocationHash()), false);
window.history.replaceState({}, '', '/dashboard');
assert.equal(nav.isLearningLinkActive('/dashboard', '/dashboard', nav.getLocationHash()), true);
listeners.popstate();
assert.equal(notifications, 3);
unsubscribe();
assert.equal(window.history.pushState, originalPush);
console.log('PASS: real account listing, submission names, safe user update, invalid inputs, hash selection and history cleanup (mock DB; no real writes).');
