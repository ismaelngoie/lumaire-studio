import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// HANDLE PATCH: Toggle Task Completion
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = getRequestContext();
    const { is_completed } = await request.json(); // Expects { is_completed: 1 } or { is_completed: 0 }

    await env.DB.prepare(`
      UPDATE tasks SET is_completed = ? WHERE id = ?
    `).bind(is_completed, params.id).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
