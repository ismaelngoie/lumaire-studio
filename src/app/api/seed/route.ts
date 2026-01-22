import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
    if (!env || !env.DB) throw new Error("DB binding missing");

    // 1. Create a Demo Planner
    const plannerId = 'planner-1';
    await env.DB.prepare(`
      INSERT OR IGNORE INTO planners (id, email, full_name) 
      VALUES (?, ?, ?)
    `).bind(plannerId, 'demo@lumaire.com', 'Ismael Ngoie').run();

    // 2. Create Client 1: Sarah & James (The classic example)
    const clientId1 = 'client-1';
    await env.DB.prepare(`
      INSERT OR IGNORE INTO clients (id, planner_id, partner_1_name, partner_2_name, email, wedding_date, venue_name, guest_count, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(clientId1, plannerId, 'Sarah', 'James', 'sarah@example.com', '2026-10-12', 'The Grand Hotel', 150, 'active').run();

    // 3. Create Wedding for Sarah
    await env.DB.prepare(`
      INSERT OR IGNORE INTO weddings (id, client_id, status)
      VALUES (?, ?, ?)
    `).bind('wedding-1', clientId1, 'planning').run();

    // 4. Create Client 2: Elena & Michael (A second active wedding)
    const clientId2 = 'client-2';
    await env.DB.prepare(`
      INSERT OR IGNORE INTO clients (id, planner_id, partner_1_name, partner_2_name, email, wedding_date, venue_name, guest_count, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(clientId2, plannerId, 'Elena', 'Michael', 'elena@example.com', '2026-11-04', 'Seaside Pavilion', 85, 'onboarding').run();

    // 5. Add some Tasks for Sarah
    await env.DB.prepare(`
      INSERT OR IGNORE INTO tasks (id, client_id, title, category, due_date, is_completed)
      VALUES 
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
    `).bind(
      'task-1', clientId1, 'Finalize seating chart', 'Planning', '2026-09-01', 0,
      'task-2', clientId1, 'Send music list to DJ', 'Music', '2026-09-05', 0
    ).run();

    // 6. Add a Vendor
    await env.DB.prepare(`
      INSERT OR IGNORE INTO vendors (id, planner_id, business_name, category, contact_name, email, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind('vendor-1', plannerId, 'Bloom & Wild', 'Florist', 'Alice Green', 'alice@bloom.com', '555-0123').run();

    return NextResponse.json({ message: "✅ Database seeded! You now have real demo data." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
