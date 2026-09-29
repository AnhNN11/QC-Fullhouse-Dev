import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import ts from "typescript";
import nextEnv from "@next/env";
const require = createRequire(import.meta.url), cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} }; cache.set(file, loaded);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localRequire = name => name === "server-only" ? {} : name.startsWith(".") ? load(path.join(path.dirname(file), name + ".ts")) : require(name);
  vm.runInThisContext("(function(require,module,exports){" + code + "\n})", { filename: file })(localRequire, loaded, loaded.exports);
  return loaded.exports;
}
const { expandedCurriculum } = load("lib/expanded-curriculum.ts");
const { practiceResources } = load("lib/resources.ts");
const { validateResource } = load("lib/content-validation.ts");
assert.equal(new Set(practiceResources.map(item => item.id)).size, practiceResources.length);
for (const resource of practiceResources) validateResource(resource, resource.id);
for (const track of expandedCurriculum) {
  assert.equal(track.course.lessons, track.lessons.length);
  assert.equal(track.course.modules.length, track.lessons.length);
  for (const [title, objective, exercise] of track.lessons) {
    assert.ok(title.length > 5);
    assert.ok(objective.length > 30 && exercise.length > 30);
  }
}
console.log(`Validated ${practiceResources.length} resources, ${expandedCurriculum.length} additional courses and ${expandedCurriculum.flatMap(t => t.lessons).length} lessons.`);
if (process.argv.includes("--apply")) {
  nextEnv.loadEnvConfig(process.cwd());
  try {
    const { importExpandedCurriculum } = load("lib/import-expanded-curriculum.ts");
    console.log("Import complete:", await importExpandedCurriculum());
    const db = await load("lib/mongodb.ts").getMongoDatabase();
    const ids = expandedCurriculum.map(t => t.course.id);
    assert.equal(await db.collection("courses").countDocuments({ id: { $in: ids } }), ids.length);
    assert.equal(await db.collection("video_lessons").countDocuments({ seedKey: /^expansion-v1:/ }), 20);
    console.log("Verified persisted courses and lessons. Existing documents were not overwritten.");
  } finally { await (await load("lib/mongodb.ts").getMongoClient()).close(); }
}
