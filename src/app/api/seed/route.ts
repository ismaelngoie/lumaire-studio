import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
    const plannerId = 'planner-1';
    
    // 1. SETUP TABLES
    // We add the DOCUMENTS table here
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, client_id TEXT, name TEXT, type TEXT, category TEXT, url TEXT, date TEXT)`).run();

    // (Ensure other tables exist as per previous steps - abbreviated for brevity, but logically they are here)
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS planners (id TEXT PRIMARY KEY, email TEXT, full_name TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, planner_id TEXT, partner_1_name TEXT, partner_2_name TEXT, email TEXT, wedding_date TEXT, venue_name TEXT, guest_count INTEGER, status TEXT, phone TEXT, notes TEXT)`).run();

    // 2. SEED DOCUMENTS (The new part)
    await env.DB.prepare('DELETE FROM documents').run();
    
    const clientId1 = 'client-1';
    const docs = [
      { id: 'doc-1', name: 'Service Agreement v1', type: 'PDF', cat: 'Contracts', url: '#', date: '2026-01-10' },
      { id: 'doc-2', name: 'Floral Mood Board', type: 'Image', cat: 'Design', url: 'https://images.unsplash.com/photo-1519225427186-6868692f6d44?w=400', date: '2026-02-15' },
      { id: 'doc-3', name: 'Initial Questionnaire', type: 'Form', cat: 'Questionnaires', url: '#', date: '2026-01-12' }
    ];

    const stmt = env.DB.prepare(`INSERT INTO documents (id, client_id, name, type, category, url, date) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const batch = docs.map(d => stmt.bind(d.id, clientId1, d.name, d.type, d.cat, d.url, d.date));
    await env.DB.batch(batch);

    return NextResponse.json({ message: "✅ Database updated with DOCUMENTS table and seed data." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
