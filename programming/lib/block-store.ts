import "server-only";
import { createHash } from "node:crypto";
import { getMongoDatabase } from "./mongodb";
import { blockChallenges } from "./block-challenges";
import { validateChallenge, type BlockChallenge, type Block } from "./blocks";
export type StoredChallenge = { _id: string; challenge: BlockChallenge; published: boolean; updatedAt?: Date };
export type BlockResult = { _id: string; userId: string; slug: string; revision: string; bestScore: number; lastScore: number; attempts: number; program: Block[]; updatedAt: Date };
export function challengeRevision(challenge: BlockChallenge) { return createHash("sha256").update(JSON.stringify(challenge)).digest("hex").slice(0, 16); }
export async function getBlockChallenges(includeHidden = false) {
  const entries = new Map<string, StoredChallenge>(blockChallenges.map(challenge => [challenge.slug, { _id: challenge.slug, challenge, published: true }]));
  for (const item of await (await getMongoDatabase()).collection<StoredChallenge>("block_challenges").find().toArray()) entries.set(item._id, item);
  return [...entries.values()].filter(entry => includeHidden || entry.published).map(entry => ({ ...entry, challenge: validateChallenge(entry.challenge) }));
}
export async function getBlockChallenge(slug: string) { return (await getBlockChallenges()).find(entry => entry._id === slug)?.challenge; }
