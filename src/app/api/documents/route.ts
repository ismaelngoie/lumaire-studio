import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// POST: Upload a File (or Save a Link)
export async function POST(request: Request) {
  try {
    const { env } = getRequestContext();
    const { client_id, name, type, category, url } = await request.json() as any;
    const id = 'doc-' + Date.now();
    const date = new Date().toISOString().split('T')[0];

    await env.DB.prepare(`
      INSERT INTO documents (id, client_id, name, type, category, url, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, client_id, name, type, category, url, date).run();

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a File
export async function DELETE(request: Request) {
  const { env } = getRequestContext();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if(!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  await env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(id).run();
  return NextResponse.json({ success: true });
}
