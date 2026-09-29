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
const { expandedProblems } = load('lib/expanded-problems.ts');
const { grade, validateTests } = load('lib/grading.ts');
for (const p of expandedProblems) {
  const tests = validateTests(p.tests);
  assert.equal((await grade(p.reference, tests)).accepted, true, p.title);
  assert.equal((await grade('function solve(){return null}', tests)).accepted, false, p.title);
  assert.equal((await grade('function solve(){return '+JSON.stringify(tests[0].expected)+'}', tests)).accepted, false, p.title);
}
console.log('PASS: 10 reference solutions, 20 incorrect solutions rejected; '+expandedProblems.reduce((n,p)=>n+p.tests.length,0)+' test cases.');
if(process.argv.includes('--apply')){
  nextEnv.loadEnvConfig(process.cwd());
  try { console.log(await load('lib/import-expanded-problems.ts').importExpandedProblems()); }
  finally { await (await load('lib/mongodb.ts').getMongoClient()).close(); }
}

