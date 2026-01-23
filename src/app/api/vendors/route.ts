import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// GET: List all vendors
export async function GET() {
  const { env } = getRequestContext();
  const { results } = await env.DB.prepare('SELECT * FROM vendors ORDER BY category ASC, company ASC').all();
  return NextResponse.json(results);
}

// POST: Add new vendor
export async function POST(request: Request) {
  try {
    const { env } = getRequestContext();
    const body = await request.json() as any;
    const id = 'v-' + Date.now();

    await env.DB.prepare(`
      INSERT INTO vendors (id, category, name, company, email, phone, website, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, body.category, body.name, body.company, body.email, body.phone, body.website, body.notes || '').run();

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
