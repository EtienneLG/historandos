import { getHikes } from '@/lib/data/hikes';
import HomeShell from './home-shell';

export default async function HomePage() {
  const traces = await getHikes();

  return (
    <main className="w-screen h-screen overflow-hidden">
      <HomeShell traces={traces} />
    </main>
  );
}