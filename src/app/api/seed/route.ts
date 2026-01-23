import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
    const plannerId = 'planner-1';
    
    // 1. Create Planner & Clients (Standard)
    await env.DB.prepare(`INSERT OR IGNORE INTO planners (id, email, full_name) VALUES (?, ?, ?)`).bind(plannerId, 'demo@lumaire.com', 'Ismael Ngoie').run();
    await env.DB.prepare(`INSERT OR IGNORE INTO clients (id, planner_id, partner_1_name, partner_2_name, email, wedding_date, venue_name, guest_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind('client-1', plannerId, 'Sarah', 'James', 'sarah@example.com', '2026-10-12', 'The Grand Hotel', 150, 'active').run();

    // 2. CREATE THE "MILLION DOLLAR" WORKFLOW TEMPLATE
    // Delete old templates to ensure clean seed
    await env.DB.prepare('DELETE FROM workflow_template_items').run();
    await env.DB.prepare('DELETE FROM workflow_templates').run();

    const templateId = 'tpl-full-service';
    await env.DB.prepare(`INSERT INTO workflow_templates (id, planner_id, name, description) VALUES (?, ?, ?, ?)`)
      .bind(templateId, plannerId, 'Full Service Planning', 'The complete A-Z checklist for luxury weddings.').run();

    // 3. ADD 15+ AUTOMATED STEPS (The "Auto-Generate" Logic)
    // days_before_wedding: How many days BEFORE the wedding is this due?
    const steps = [
      { days: 365, title: 'Define Budget & Priorities', cat: 'Planning' },
      { days: 330, title: 'Scout & Book Venue', cat: 'Venue' },
      { days: 300, title: 'Hire Photographer & Videographer', cat: 'Vendors' },
      { days: 270, title: 'Book Catering & Bar', cat: 'Catering' },
      { days: 240, title: 'Wedding Dress Shopping', cat: 'Attire' },
      { days: 210, title: 'Book Florist & Decor', cat: 'Design' },
      { days: 180, title: 'Send Save the Dates', cat: 'Stationery' },
      { days: 150, title: 'Book Entertainment (DJ/Band)', cat: 'Entertainment' },
      { days: 120, title: 'Order Wedding Cake', cat: 'Catering' },
      { days: 90,  title: 'Send Formal Invitations', cat: 'Stationery' },
      { days: 60,  title: 'Finalize Menu & Tasting', cat: 'Catering' },
      { days: 45,  title: 'Create Seating Chart', cat: 'Planning' },
      { days: 30,  title: 'Final Walkthrough at Venue', cat: 'Venue' },
      { days: 14,  title: 'Confirm Vendor Arrival Times', cat: 'Logistics' },
      { days: 7,   title: 'Pack Personal Items & Decor', cat: 'Logistics' }
    ];

    const stmt = env.DB.prepare(`INSERT INTO workflow_template_items (id, template_id, title, category, days_before_wedding) VALUES (?, ?, ?, ?, ?)`);
    const batch = steps.map((s, i) => stmt.bind(`step-${i}`, templateId, s.title, s.cat, s.days));
    await env.DB.batch(batch);

    return NextResponse.json({ message: "✅ Database seeded with 'Full Service' Workflow Template." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
