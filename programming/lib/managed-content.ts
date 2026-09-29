import "server-only";
import { getMongoDatabase } from "./mongodb";
import { practiceResources, type PracticeResource } from "./resources";
import { roadmaps, type LearningRoadmap } from "./roadmaps";
import { roadmapGuides, type RoadmapGuide } from "./roadmap-guides";
export type RoadmapBundle = { roadmap: LearningRoadmap; guide: RoadmapGuide };
export type ContentEntry = { _id: string; kind: "resource" | "roadmap"; slug: string; published: boolean; data: PracticeResource | RoadmapBundle; updatedAt?: Date };
export async function getManagedContent(includeHidden = false) {
  const defaults: ContentEntry[] = [
    ...practiceResources.map(data => ({ _id: `resource:${data.id}`, kind: "resource" as const, slug: data.id, published: true, data })),
    ...roadmaps.map(roadmap => ({ _id: `roadmap:${roadmap.slug}`, kind: "roadmap" as const, slug: roadmap.slug, published: true, data: { roadmap, guide: roadmapGuides[roadmap.slug] } })),
  ];
  const records = await (await getMongoDatabase()).collection<ContentEntry>("managed_content").find().toArray();
  const entries = new Map(defaults.map(item => [item._id, item]));
  for (const item of records) entries.set(item._id, item);
  return [...entries.values()].filter(item => includeHidden || item.published);
}
export async function getResources() {
  return (await getManagedContent()).filter(item => item.kind === "resource").map(item => item.data as PracticeResource);
}
export async function getRoadmapContent() {
  const bundles = (await getManagedContent()).filter(item => item.kind === "roadmap").map(item => item.data as RoadmapBundle);
  return { roadmaps: bundles.map(item => item.roadmap), guides: Object.fromEntries(bundles.map(item => [item.roadmap.slug, item.guide])) };
}
export async function getManagedRoadmap(slug: string) {
  const content = await getRoadmapContent();
  const roadmap = content.roadmaps.find(item => item.slug === slug);
  return roadmap ? { roadmap, guide: content.guides[slug] } : undefined;
}
