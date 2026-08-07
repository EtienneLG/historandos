import { getHikes } from '@/lib/data';
import HomeShell from './_components/home-shell';

export default async function HomePage() {
  const hikes = await getHikes();

  return (
    <main className="w-screen h-screen overflow-hidden">
      <HomeShell hikes={hikes} />
    </main>
  );
}