import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
    if (!env || !env.DB) throw new Error("DB binding missing");

    // 1. Create Planner & Clients (Standard)
    const plannerId = 'planner-1';
    await env.DB.prepare(`INSERT OR IGNORE INTO planners (id, email, full_name) VALUES (?, ?, ?)`).bind(plannerId, 'demo@lumaire.com', 'Ismael Ngoie').run();
    
    const clientId1 = 'client-1';
    await env.DB.prepare(`INSERT OR IGNORE INTO clients (id, planner_id, partner_1_name, partner_2_name, email, wedding_date, venue_name, guest_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(clientId1, plannerId, 'Sarah', 'James', 'sarah@example.com', '2026-10-12', 'The Grand Hotel', 150, 'active').run();

    // 2. THE TIMELINE (Rich Demo Data)
    // We delete old events first to ensure a clean slate for the demo
    await env.DB.prepare('DELETE FROM timeline_events WHERE client_id = ?').bind(clientId1).run();
    
    const events = [
      { time: '09:00', act: 'Bridal Party Hair & Makeup', note: 'Suite 404' },
      { time: '11:30', act: 'Photographer Arrives', note: 'Capture details (dress, rings)' },
      { time: '12:30', act: 'First Look', note: 'Hotel Garden' },
      { time: '13:00', act: 'Wedding Party Photos', note: 'Lobby Staircase' },
      { time: '14:00', act: 'Ceremony Setup Begins', note: 'Florist on site' },
      { time: '15:30', act: 'Guests Arrive', note: 'String Quartet playing' },
      { time: '16:00', act: 'Ceremony Starts', note: 'Processional' },
      { time: '16:45', act: 'Cocktail Hour', note: 'Terrace' },
      { time: '18:00', act: 'Grand Entrance & First Dance', note: 'Ballroom' },
      { time: '19:00', act: 'Dinner Service', note: 'Plated' },
      { time: '20:30', act: 'Cake Cutting', note: '' },
      { time: '22:45', act: 'Sparkler Exit', note: 'Front Drive' }
    ];

    const stmt = env.DB.prepare(`INSERT INTO timeline_events (id, client_id, start_time, activity, notes) VALUES (?, ?, ?, ?, ?)`);
    const batch = events.map((evt, i) => stmt.bind(`evt-${i}`, clientId1, evt.time, evt.act, evt.note));
    await env.DB.batch(batch);

    return NextResponse.json({ message: "✅ Database seeded with a FULL WEDDING TIMELINE for Sarah & James." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
