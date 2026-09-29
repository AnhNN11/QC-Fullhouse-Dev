import 'server-only';
import { expandedProblems } from './expanded-problems';
import { getMongoDatabase } from './mongodb';
import { grade, validateTests } from './grading';

export async function importExpandedProblems() {
  // Validate all content before any writes. Never overwrite an admin-authored problem.
  for (const p of expandedProblems) {
    if (!(await grade(p.reference, validateTests(p.tests))).accepted) throw new Error(`Bộ test bài ${p.id} không đạt.`);
  }
  const db = await getMongoDatabase();
  let inserted = 0;
  for (const { reference, tests, ...problem } of expandedProblems) {
    const existing = await db.collection('problems').findOne({ id: problem.id });
    if (existing && existing.seedKey !== `practice-v2:${problem.id}`) continue;
    const result = await db.collection('problems').updateOne({ id: problem.id }, { $setOnInsert: { ...problem, seedKey: `practice-v2:${problem.id}`, createdAt: new Date(), updatedAt: new Date() } }, { upsert: true });
    inserted += result.upsertedCount;
    await db.collection('judge_configs').updateOne({ problemId: problem.id }, { $setOnInsert: { problemId: problem.id, tests, reference, enabled: true, updatedAt: new Date() } }, { upsert: true });
  }
  return { inserted, checked: expandedProblems.length };
}
