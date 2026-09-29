import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function load(file, mocks = {}) {
  const loaded = { exports: {} };
  const require = name => { if (name in mocks) return mocks[name]; throw new Error(`Unexpected dependency ${name}`); };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module: loaded, exports: loaded.exports, require, Set, Map, structuredClone, JSON, Object, Number, Error });
  return loaded.exports;
}
const engine = load("lib/blocks.ts"), { blockChallenges } = load("lib/block-challenges.ts"), { blockSolutions } = load("lib/block-solutions.ts");
const editor = load("lib/block-editor.ts");
for (const c of blockChallenges) {
  engine.validateChallenge(c);
  const result = engine.gradeBlocks(c, blockSolutions[c.slug]);
  assert.equal(result.score,100,c.slug);
  assert.ok(result.passed && result.efficient,c.slug);
  assert.ok(engine.gradeBlocks(c,[]).score < 100,c.slug);
}
const first = blockChallenges[0];
assert.throws(()=>engine.gradeBlocks(first,[{id:"bad",kind:"eval",count:1}]));
assert.throws(()=>engine.gradeBlocks(first,[{id:"bad",kind:"move",count:Infinity}]));
assert.throws(()=>engine.gradeBlocks(first,[{id:"same",kind:"move",count:1},{id:"same",kind:"move",count:1}]));
const collision = engine.gradeBlocks(first,[{id:"move",kind:"move",count:10}]);
assert.equal(collision.passed,false); assert.match(collision.results[0].error,/tường/);
const inefficient = engine.gradeBlocks(first,[1,2,3].map(i=>({id:String(i),kind:"move",count:1})));
assert.equal(inefficient.score,90); assert.equal(inefficient.efficient,false);
const condition = blockChallenges.find(c=>c.slug==="sense-the-wall");
assert.equal(engine.gradeBlocks(condition,[{id:"m",kind:"move",count:1}]).passed,false);
let nested = [{id:"leaf",kind:"right"}];
for(let i=0;i<4;i++)nested=[{id:`loop${i}`,kind:"repeat",count:20,body:nested}];
const bounded = engine.gradeBlocks(blockChallenges[3],nested);
assert.match(bounded.results[0].error,/500/);
for(let i=4;i<8;i++)nested=[{id:`loop${i}`,kind:"repeat",count:20,body:nested}];
assert.throws(()=>engine.gradeBlocks(blockChallenges[3],nested));
assert.throws(()=>engine.validateChallenge({...first,worlds:[]}));
assert.throws(()=>engine.validateChallenge({...first,worlds:[{...first.worlds[0],walls:[first.worlds[0].start]}]}));
const p=[editor.newBlock("move","a"),editor.newBlock("right","b"),editor.newBlock("repeat","loop")];
const moved=editor.insertBlock(p,p[0],{parent:"loop",branch:"body",index:0},true);
assert.equal(moved.length,2);assert.equal(moved[1].body[0].id,"a");assert.equal(p.length,3);
assert.throws(()=>editor.insertBlock(moved,moved[1],{parent:"a",branch:"body",index:0},true));
const reordered=editor.insertBlock(p,p[0],{parent:null,branch:"body",index:3},true);
assert.equal(reordered[2].id,"a");
assert.equal(editor.removeBlock(moved,"loop").length,1);
console.log("PASS: 8 reference solutions/100 points, wrong solutions, collision, partial/efficiency score, multi-world condition, 500-step budget, depth limit, invalid config, reorder, nested drop and cycle rejection.");
