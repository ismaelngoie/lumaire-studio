import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { env } = getRequestContext();
  const { id } = await params;
  const { status } = await request.json() as any;

  await env.DB.prepare('UPDATE invoices SET status = ? WHERE id = ?').bind(status, id).run();
  return NextResponse.json({ success: true });
}
