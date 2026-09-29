import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const nativeRequire = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const loaded = { exports: {} };
  const require = name => {
    if (name in mocks) return mocks[name];
    if (name === "server-only") return {};
    throw new Error(`Unexpected dependency ${name} in ${file}`);
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { module: loaded, exports: loaded.exports, require, Date, Set, Map, URL, Response, JSON, process, Buffer });
  return loaded.exports;
}
const validation = load("lib/content-validation.ts");
const { practiceResources } = load("lib/resources.ts", { "./extra-resources": load("lib/extra-resources.ts") });
const { roadmaps } = load("lib/roadmaps.ts");
const { roadmapGuides } = load("lib/roadmap-guides.ts");
for (const item of practiceResources) validation.validateResource(item, item.id);
for (const roadmap of roadmaps) validation.validateRoadmap({ roadmap, guide: roadmapGuides[roadmap.slug] }, roadmap.slug);
assert.throws(() => validation.validateResource({ ...practiceResources[0], source: "javascript:alert(1)" }, practiceResources[0].id));
assert.throws(() => validation.validateResource({ ...practiceResources[0], minutes: -1 }, practiceResources[0].id));
const bundle = { roadmap: structuredClone(roadmaps[0]), guide: structuredClone(roadmapGuides[roadmaps[0].slug]) };
bundle.roadmap.stages[0].nodes[1].id = bundle.roadmap.stages[0].nodes[0].id;
assert.throws(() => validation.validateRoadmap(bundle, bundle.roadmap.slug));
bundle.guide.stages.pop();
assert.throws(() => validation.validateRoadmap(bundle, bundle.roadmap.slug));
console.log("PASS content: all existing resources/roadmaps, unsafe URL, invalid duration, duplicate nodes, stage mismatch");

let user = { id: "learner-a" }, enrolled = true, demo = false, grant = false, writes = 0, activities = 0;
const lessonId = "123456789012345678901234";
const db = { collection(name) { return {
  async findOne() { return name === "courses" ? { id: "python" } : name === "course_enrollments" ? enrolled ? {} : null : name === "video_lessons" ? { demo } : name === "course_access" ? grant ? {} : null : null; },
  async updateOne(filter) { assert.equal(name, "lesson_progress"); assert.equal(filter._id, JSON.stringify([user.id, "python", lessonId])); writes++; },
}; } };
const progress = load("lib/course-progress.ts", { mongodb: nativeRequire("mongodb"), "./mongodb": { getMongoDatabase: async () => db }, "./user-auth": { getSessionUser: async () => user }, "./enrollment": { enrollmentKey: (...args) => JSON.stringify(args) }, "./record-activity": { recordActivity: async () => activities++ } });
assert.equal(progress.calculateProgress([], []), 0);
assert.equal(progress.calculateProgress(["a", "b"], ["a", "a", "deleted"]), 50);
await assert.rejects(progress.completeLesson("python", lessonId));
demo = true; enrolled = false;
await assert.rejects(progress.completeLesson("python", lessonId));
enrolled = true;
await progress.completeLesson("python", lessonId);
assert.equal(writes, 1); assert.equal(activities, 1);
demo = false; grant = true;
await progress.completeLesson("python", lessonId);
user = null;
await assert.rejects(progress.completeLesson("python", lessonId));
assert.equal(writes, 2);
console.log("PASS progress: enrollment, demo/private access, anonymous denial, idempotent key and percentage derived from published lessons");

const route = load("app/api/progress/route.ts", { "@/lib/course-progress": { completeLesson: async () => {} }, "@/lib/user-auth": { getSessionUser: async () => ({ id: "a" }), sameOrigin: () => true } });
assert.equal((await route.PATCH(new Request("http://localhost/api/progress", { method: "PATCH", body: JSON.stringify({ courseId: "python", progress: 100 }) }))).status, 400);
assert.equal((await route.PATCH(new Request("http://localhost/api/progress", { method: "PATCH", body: JSON.stringify({ courseId: "python", lessonId }) }))).status, 200);

const operations = [];
let ended = 0;
const session = { withTransaction: async callback => callback(), endSession: async () => ended++ };
const deletionDb = { collection(name) { return {
  findOne: async () => ({}),
  deleteOne: async (query, options) => { assert.equal(options.session, session); operations.push([name, query]); },
  deleteMany: async (query, options) => { assert.equal(options.session, session); operations.push([name, query]); },
  updateOne: async (query, update, options) => { assert.equal(options.session, session); operations.push([name, query, update]); },
  updateMany: async (query, update, options) => { assert.equal(options.session, session); operations.push([name, query, update]); },
}; } };
const data = load("lib/db.ts", { "./content": {}, "./mongodb": { getMongoDatabase: async () => deletionDb, getMongoClient: async () => ({ startSession: () => session }) }, "./user-auth": {}, mongodb: nativeRequire("mongodb"), "./activity": {}, "./course-progress": progress });
await data.deleteAdminCourse("python");
assert.deepEqual(operations.map(op => op[0]), ["courses", "course_progress", "lesson_progress", "video_lessons", "course_access", "course_enrollments"]);
operations.length = 0;
await data.deleteAdminProblem(42);
assert.deepEqual(operations.map(op => op[0]), ["content_sequences", "problems", "problem_progress", "user_problem_progress", "submissions", "judge_configs", "users"]);
assert.equal(operations[0][2].$max.value, 42);
assert.equal(operations.at(-1)[2].$pull.gradedProblemIds, 42);
assert.equal(ended, 2);
console.log("PASS deletion: cascade collections, transaction session, non-reusable problem sequence and XP marker cleanup");

let attempts = 0, sessions = 0;
const admin = load("app/admin/actions.ts", { "@/lib/admin-auth": { validateAdminCredentials: () => false, createAdminSession: async () => sessions++ }, "next/navigation": {}, "@/lib/mongodb": { getMongoDatabase: async () => ({ collection: () => ({ createIndex: async () => {}, findOneAndUpdate: async () => ({ count: ++attempts }) }) }) } });
let result;
for (let i = 0; i < 11; i++) { const form = new FormData(); form.set("username", `name-${i}`); form.set("password", "invalid"); result = await admin.loginAdmin(undefined, form); }
assert.match(result.error, /10 phút/); assert.equal(sessions, 0);
console.log("PASS admin: shared throttle cannot be bypassed with different usernames; no session created");
