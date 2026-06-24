import { Trace } from '@/types/trace';
import HomeShell from './_components/home-shell';

async function getTraces(): Promise<Trace[]> {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const metadataId = process.env.INFOMANIAK_METADATA_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;
  
  // try fetching from API, fall back to local sample data on error
  try {
    const response = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${metadataId}/download`, { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) 
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    
    const data = await response.json();
    const traces: Trace[] = data.traces;

    return traces;
  } catch (error) {
    console.error('Error fetching traces:', error);
    
    return [];
  }
}

export default async function HomePage() {
  const traces = await getTraces();

  return (
    <main className="w-screen h-screen overflow-hidden">
      <HomeShell traces={traces} />
    </main>
  );
}