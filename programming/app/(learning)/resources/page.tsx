import ResourceExplorer from "@/app/resource-explorer";
import { getResources } from "@/lib/managed-content";
import { getBlockChallenges } from "@/lib/block-store";
export const dynamic = "force-dynamic";
export default async function ResourcesPage() {
  const [resources, blocks] = await Promise.all([getResources(), getBlockChallenges()]);
  return <ResourceExplorer practiceResources={resources} blockCount={blocks.length}/>;
}
