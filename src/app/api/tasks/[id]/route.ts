import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// 1. Define the interface so TypeScript knows what to expect
interface TaskUpdateData {
  is_completed: number;
}

// HANDLE PATCH: Toggle Task Completion
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { env } = getRequestContext();
    const { id } = await params;
    
    // 2. Cast the JSON to our interface
    const body = (await request.json()) as TaskUpdateData;
    const { is_completed } = body;

    await env.DB.prepare(`
      UPDATE tasks SET is_completed = ? WHERE id = ?
    `).bind(is_completed, id).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
