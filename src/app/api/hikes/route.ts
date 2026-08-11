import { NextRequest, NextResponse } from 'next/server';
import { createHike } from '@/lib/data';
import { NewHikeRequestSchema } from '@/types/hike-types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = NewHikeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const id = await createHike(parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error creating hike:', message);
    return NextResponse.json({ error: 'Failed to create hike' }, { status: 500 });
  }
}
