import { notFound } from "next/navigation";
import { getBlockChallenge, challengeRevision, type BlockResult } from "@/lib/block-store";
import { getMongoDatabase } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/user-auth";
import BlockStudio from "@/app/block-studio";
export const dynamic = "force-dynamic";
export default async function BlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const challenge = await getBlockChallenge((await params).slug);
  if (!challenge) notFound();
  const user = await getSessionUser();
  const saved = user ? await (await getMongoDatabase()).collection<BlockResult>("block_results").findOne({ _id: JSON.stringify([user.id, challenge.slug, challengeRevision(challenge)]) }) : null;
  return <BlockStudio key={challengeRevision(challenge)} challenge={challenge} initialProgram={saved?.program ?? []} initialBest={saved?.bestScore ?? null}/>;
}
