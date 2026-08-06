import { z } from 'zod';
import { HikeSchema, Hike } from '@/types/hike';

const DRIVE_ID = process.env.INFOMANIAK_DRIVE_ID;
const METADATA_ID = process.env.INFOMANIAK_METADATA_ID;
const DRIVE_SECRET = process.env.INFOMANIAK_DRIVE_SECRET;

export async function getHikes(): Promise<Hike[]> {
  try {
    const response = await fetch(`https://api.infomaniak.com/2/drive/${DRIVE_ID}/files/${METADATA_ID}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DRIVE_SECRET}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) 
      throw new Error(`Failed to fetch metadata: ${response.status}`);

    const data = await response.json();

    return z.array(HikeSchema).parse(data);
  } catch (error) {
    console.error('Error fetching traces:', error);

    return [];
  }
}
