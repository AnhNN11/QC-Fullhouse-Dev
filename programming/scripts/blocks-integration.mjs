// Uses explicitly named temporary records only; never edits an existing user/course.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import assert from "node:assert/strict";
import ts from "typescript";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
const require = createRequire(import.meta.url), cache = new Map();
let activeUser = null, admin = false;
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} }; cache.set(file, loaded);
  const localRequire = name => {
    if (name === "server-only") return {};
    if (name === "next/cache") return { revalidatePath() {} };
    if (name === "@/lib/user-auth") return { getSessionUser: async () => activeUser, sameOrigin: r => r.headers.get("origin") === new URL(r.url).origin };
    if (name === "@/lib/admin-auth") return { isAdminAuthenticated: async () => admin };
    if (name.startsWith("@/")) return load(name.slice(2)+".ts");
    if (name.startsWith(".")) return load(path.join(path.dirname(file),name+".ts"));
    return require(name);
  };
  const code = ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  vm.runInThisContext("(function(require,module,exports){"+code+"\n})",{filename:file})(localRequire,loaded,loaded.exports);
  return loaded.exports;
}
const client = await load("lib/mongodb.ts").getMongoClient(), db = client.db();
const ids = [new ObjectId(),new ObjectId()], userIds = ids.map(id=>id.toString());
const slug = "test-block-"+randomUUID();
try {
  await db.collection("users").insertMany(ids.map(_id=>({_id,name:"Temporary block regression",email:`block-regression-${_id}@example.invalid`,createdAt:new Date(),xp:0,level:1})));
  const { POST } = load("app/api/blocks/[slug]/route.ts");
  const { blockSolutions } = load("lib/block-solutions.ts");
  const { blockChallenges } = load("lib/block-challenges.ts");
  const store = load("lib/block-store.ts");
  async function submit(program, origin="http://localhost", target="first-swim") {
    return POST(new Request(`http://localhost/api/blocks/${target}`,{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify({program,score:100,bestScore:100,userId:userIds[1]})}),{params:Promise.resolve({slug:target})});
  }
  assert.equal((await submit(blockSolutions["first-swim"])).status,401);
  activeUser={id:userIds[0],name:"Temporary block regression"};
  assert.equal((await submit(blockSolutions["first-swim"],"https://attacker.invalid")).status,403);
  assert.equal((await submit(blockSolutions["first-swim"],"http://localhost","does-not-exist")).status,404);
  const wrong=[{id:"m",kind:"move",count:1}];
  let response=await submit(wrong); assert.equal(response.status,200);
  let result=await response.json(); assert.equal(result.score,0); assert.equal(result.bestScore,0);
  result=await (await submit(blockSolutions["first-swim"])).json(); assert.equal(result.score,100); assert.equal(result.bestScore,100);
  result=await (await submit(wrong)).json(); assert.equal(result.score,0); assert.equal(result.bestScore,100); assert.equal(result.attempts,3);
  const saved=await db.collection("block_results").findOne({userId:userIds[0],slug:"first-swim"});
  assert.equal(saved.bestScore,100);assert.equal(saved.program[0].count,1);
  assert.equal(await db.collection("block_results").countDocuments({userId:userIds[1]}),0);
  activeUser={id:userIds[1],name:"Temporary block regression"};
  result=await (await submit(wrong)).json();assert.equal(result.bestScore,0);
  assert.ok(await db.collection("learning_activity").findOne({userId:userIds[0]}));
  const {saveBlockChallenge}=load("app/admin/blocks/actions.ts");
  const challenge={...blockChallenges[0],slug};
  const form=new FormData();form.set("challenge",JSON.stringify(challenge));form.set("solution",JSON.stringify(wrong));form.set("published","on");
  assert.ok((await saveBlockChallenge({},form)).error);
  admin=true;
  assert.ok((await saveBlockChallenge({},form)).error);
  assert.equal(await db.collection("block_challenges").countDocuments({_id:slug}),0);
  form.set("solution",JSON.stringify(blockSolutions["first-swim"]));
  assert.ok((await saveBlockChallenge({},form)).success);
  assert.ok(await store.getBlockChallenge(slug));
  form.set("originalSlug",slug);form.delete("published");
  assert.ok((await saveBlockChallenge({},form)).success);
  assert.equal(await store.getBlockChallenge(slug),undefined);
  assert.equal((await submit(blockSolutions["first-swim"],"http://localhost",slug)).status,404);
  const edited={...challenge,maxBlocks:2};assert.notEqual(store.challengeRevision(challenge),store.challengeRevision(edited));
  console.log("PASS persisted grading: auth/origin, forged score ignored, personal isolation, best score retained, program restored from DB, activity recorded, admin permission, reference validation, publication/hiding and version separation.");
} finally {
  await db.collection("users").deleteMany({_id:{$in:ids}});
  await db.collection("block_results").deleteMany({userId:{$in:userIds}});
  await db.collection("learning_activity").deleteMany({userId:{$in:userIds}});
  await db.collection("block_attempt_limits").deleteMany({_id:{$regex:`^(${userIds.join("|")}):`}});
  await db.collection("block_challenges").deleteOne({_id:slug});
  await client.close();
  console.log("Removed only temporary regression users, results, rate-limit/activity records and challenge.");
}
