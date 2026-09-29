import { notFound } from 'next/navigation';
import { getManagedRoadmap } from '@/lib/managed-content';
export const dynamic = 'force-dynamic';
import RoadmapView from '@/app/roadmaps/roadmap-view';
import '@/app/roadmaps/roadmaps.css';
export default async function Page({ params }: { params: Promise<{slug:string}> }) {
  const bundle = await getManagedRoadmap((await params).slug);
  const roadmap = bundle?.roadmap;
  if (!roadmap) notFound();
  return <main className="rm"><RoadmapView key={roadmap.slug} roadmap={roadmap} guide={bundle!.guide}/></main>;
}
