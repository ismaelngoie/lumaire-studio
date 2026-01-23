import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// GET: Fetch all invoices (with client names)
export async function GET() {
  const { env } = getRequestContext();
  const { results } = await env.DB.prepare(`
    SELECT invoices.*, clients.partner_1_name, clients.partner_2_name 
    FROM invoices 
    JOIN clients ON invoices.client_id = clients.id 
    ORDER BY created_at DESC
  `).all();
  return NextResponse.json(results);
}

// POST: Create Invoice
export async function POST(request: Request) {
  try {
    const { env } = getRequestContext();
    const body = await request.json() as any;
    const id = 'inv-' + Date.now();
    const number = 'INV-' + Math.floor(1000 + Math.random() * 9000);
    const createdAt = new Date().toISOString().split('T')[0];

    // Calculate Total
    const total = body.items.reduce((sum: number, item: any) => sum + Number(item.amount), 0);

    await env.DB.prepare(`
      INSERT INTO invoices (id, client_id, number, status, due_date, items, total_amount, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, body.client_id, number, 'Draft', body.due_date, JSON.stringify(body.items), total, createdAt).run();

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
