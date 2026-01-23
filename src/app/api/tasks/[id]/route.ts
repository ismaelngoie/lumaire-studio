import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// HANDLE PATCH: Toggle Task Completion
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // FIX: Type as Promise
) {
  try {
    const { env } = getRequestContext();
    const { id } = await params; // FIX: Await the params
    const { is_completed } = await request.json(); 

    await env.DB.prepare(`
      UPDATE tasks SET is_completed = ? WHERE id = ?
    `).bind(is_completed, id).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
