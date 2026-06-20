import { Trace } from '@/types/trace';
import TraceTabs from './_components/TraceTabs';

async function getTraces(): Promise<Trace[]> {
  return [
    { id: 1, title: "Trace 1", description: "desc 1", date: "2026-06-12", lat: 46.034680, lng: 5.399601 },
    { id: 2, title: "Trace 2", description: "desc 2", date: "2026-05-07", lat: 45.944728, lng: 5.484853 },
    { id: 3, title: "Trace 3", description: "desc 3", date: "2025-11-01", lat: 46.145688, lng: 5.479381 },
    { id: 4, title: "Trace 4", description: "desc 4", date: "2026-06-09", lat: 46.876540, lng: 5.399601 },
    { id: 5, title: "Trace 5", description: "desc 5", date: "2026-06-02", lat: 46.876540, lng: 5.973112 },
  ];
}

export default async function HomePage() {
  const traces = await getTraces();

  return (
    <main className="w-screen h-screen overflow-hidden">
      <TraceTabs traces={traces} />
    </main>
  );
}