import RoadmapCatalog from '@/app/roadmaps/roadmap-catalog';
import '@/app/roadmaps/roadmaps.css';
export const metadata = { title: 'Lộ trình học lập trình | DolphinX' };
import { getRoadmapContent } from "@/lib/managed-content";
export const dynamic = "force-dynamic";
export default async function Page() { return <main className="rm"><RoadmapCatalog {...await getRoadmapContent()}/></main>; }
