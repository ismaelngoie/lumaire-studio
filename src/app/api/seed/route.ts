import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
    
    // 1. HARD RESET ALL TABLES (To ensure clean state)
    // We are adding email_queue, so we need to ensure it exists
    await env.DB.prepare('DROP TABLE IF EXISTS email_queue').run();

    // 2. CREATE TABLES
    // email_queue: Holds drafted automations waiting for approval
    // status: 'pending', 'sent', 'dismissed'
    await env.DB.prepare(`CREATE TABLE email_queue (id TEXT PRIMARY KEY, client_id TEXT, subject TEXT, body TEXT, type TEXT, due_date TEXT, status TEXT)`).run();

    // (Re-create other tables - keeping them consistent)
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS planners (id TEXT PRIMARY KEY, email TEXT, full_name TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, planner_id TEXT, partner_1_name TEXT, partner_2_name TEXT, email TEXT, wedding_date TEXT, venue_name TEXT, guest_count INTEGER, status TEXT, phone TEXT, notes TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS vendors (id TEXT PRIMARY KEY, category TEXT, name TEXT, company TEXT, email TEXT, phone TEXT, website TEXT, notes TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS vendor_assignments (id TEXT PRIMARY KEY, client_id TEXT, vendor_id TEXT, role TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, client_id TEXT, name TEXT, type TEXT, category TEXT, url TEXT, date TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, client_id TEXT, number TEXT, status TEXT, due_date TEXT, items JSON, total_amount INTEGER, created_at TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS social_tracker (id TEXT PRIMARY KEY, client_id TEXT, type TEXT, value TEXT, platform TEXT, status TEXT)`).run();

    // 3. SEED DATA (Client)
    const clientId1 = 'client-1';
    await env.DB.prepare(`INSERT OR IGNORE INTO clients (id, planner_id, partner_1_name, partner_2_name, email, wedding_date, venue_name, guest_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(clientId1, 'planner-1', 'Sarah', 'James', 'sarah@example.com', '2026-10-12', 'The Grand Hotel', 150, 'active').run();

    // 4. SEED A PENDING AUTOMATION (For Demo)
    // Imagine a task is due soon, so we auto-generated a reminder
    await env.DB.prepare(`INSERT INTO email_queue (id, client_id, subject, body, type, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        'queue-1', 
        clientId1, 
        'Reminder: Venue Payment Due', 
        'Hi Sarah & James,\n\nJust a quick friendly reminder that your venue deposit is coming up on Oct 12th. Let me know if you need any help with the transfer!\n\nBest,\nIsmael', 
        'reminder', 
        '2026-01-24', 
        'pending'
      ).run();

    return NextResponse.json({ message: "✅ Database updated with EMAIL QUEUE." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
