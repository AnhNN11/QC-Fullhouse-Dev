// Local maintenance command. Uses environment DB credentials; never exposes them.
// --seed imports authored demo content. Without it, only sandbox tests run.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} }; cache.set(file, loaded);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localRequire = name => {
    if (name === 'server-only') return {};
    if (name === 'next/cache') return { revalidatePath() {} };
    // Explicit CLI authority only; the web action always performs real admin auth.
    if (name === '@/lib/admin-auth') return { isAdminAuthenticated: async () => true };
    if (name.startsWith('@/')) return load(name.slice(2) + '.ts');
    if (name.startsWith('.')) return load(path.join(path.dirname(file), name + '.ts'));
    return require(name);
  };
  // Only transpiled repository modules run here, NEVER learner code.
  vm.runInThisContext('(function(require,module,exports){' + code + '\n})', { filename: file })(localRequire, loaded, loaded.exports);
  return loaded.exports;
}
try {
  const { grade } = load('lib/grading.ts');
  const { gradedProblems } = load('lib/teaching-seed.ts');
  for (const problem of gradedProblems) assert.equal((await grade(problem.reference, problem.tests)).accepted, true);
  const tests = [{ args: [], expected: true, sample: true }];
  assert.equal((await grade('function solve(){return false}', tests)).accepted, false);
  assert.equal((await grade('function solve(){while(true){}}', tests)).accepted, false);
  assert.equal((await grade('function solve(){return typeof process==="undefined" && typeof require==="undefined" && typeof fetch==="undefined"}', tests)).accepted, true);
  assert.equal((await grade('function solve( {', tests)).accepted, false);
  assert.equal((await grade('function solve(){return "x".repeat(200000)}', tests)).accepted, false);
  console.log('PASS: reference solutions, wrong answer, infinite loop, no host I/O, syntax error, oversized output.');
  if (process.argv.includes('--seed')) {
    const form = new FormData(); form.set('action', 'seed');
    const result = await load('app/admin/judge/actions.ts').manageTeaching({}, form);
    if (result.error) throw new Error(result.error);
    console.log('PASS: demo curriculum imported idempotently.');
  }
  process.exit(0);
} catch (error) { console.error(error.message); process.exit(1); }
