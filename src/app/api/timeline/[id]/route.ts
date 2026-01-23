import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// DELETE Event
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { env } = getRequestContext();
  const { id } = await params;
  await env.DB.prepare('DELETE FROM timeline_events WHERE id = ?').bind(id).run();
  return NextResponse.json({ success: true });
}

// PATCH: Edit Event Time or Activity
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { env } = getRequestContext();
    const { id } = await params;
    const body = await request.json() as any;

    const updates: string[] = [];
    const values: any[] = [];

    if (body.start_time !== undefined) { updates.push("start_time = ?"); values.push(body.start_time); }
    if (body.activity !== undefined) { updates.push("activity = ?"); values.push(body.activity); }
    
    if (updates.length > 0) {
      values.push(id);
      await env.DB.prepare(`UPDATE timeline_events SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
