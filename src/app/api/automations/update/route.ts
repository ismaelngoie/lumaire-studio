import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { env } = getRequestContext();
  const { id, status } = await request.json() as any;
  await env.DB.prepare('UPDATE email_queue SET status = ? WHERE id = ?').bind(status, id).run();
  return NextResponse.json({ success: true });
}
