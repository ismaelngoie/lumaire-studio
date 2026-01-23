import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { getRequestContext } from '@cloudflare/next-on-pages';
import TaskList from '@/components/dashboard/TaskList';

export const runtime = 'edge';

// --- TYPES ---
interface CountResult { count: number; }
interface Task { id: string; title: string; category: string; due_date: string; is_completed: number; }
interface Wedding { id: string; partner_1_name: string; partner_2_name: string; wedding_date: string; venue_name: string; }
interface Message { id: string; type: 'email' | 'call' | 'text'; summary: string; date: string; partner_1_name: string; }

// --- DATA FETCHING ---
async function getDashboardData() {
  const { env } = getRequestContext();
  
  // 1. High-Level Stats
  const stats = await env.DB.prepare("SELECT COUNT(*) as count FROM clients WHERE status = 'active'").first<CountResult>();
  
  // 2. Tasks (Fetch ALL tasks, so we can toggle them locally, filtered by 'not completed' generally or show last 5)
  // We fetch only uncompleted ones for the "Today's Focus" list to keep it clean.
  const { results: tasks } = await env.DB.prepare("SELECT * FROM tasks WHERE is_completed = 0 ORDER BY due_date ASC LIMIT 10").all<Task>();

  // 3. Upcoming Weddings
  const { results: weddings } = await env.DB.prepare("SELECT * FROM clients WHERE status = 'active' ORDER BY wedding_date ASC LIMIT 3").all<Wedding>();

  // 4. Recent Messages
  const { results: messages } = await env.DB.prepare(`
    SELECT messages.id, messages.type, messages.summary, messages.date, clients.partner_1_name 
    FROM messages 
    LEFT JOIN clients ON messages.client_id = clients.id
    ORDER BY messages.date DESC 
    LIMIT 5
  `).all<Message>();

  const nextDeadline = tasks.length > 0 ? tasks[0].due_date : "None";

  return {
    activeWeddings: stats?.count ?? 0,
    tasks: tasks || [],
    weddings: weddings || [],
    messages: messages || [],
    nextDeadline,
    // "High Level Business View": Calculate revenue based on active clients
    estimatedRevenue: (stats?.count ?? 0) * 4500 
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-lumaire-ivory p-8">
      {/* 1. COMMAND CENTER HEADER */}
      <header className="flex justify-between items-end mb-12 border-b border-lumaire-brown/10 pb-6">
        <div>
          <p className="text-sm font-sans uppercase tracking-widest text-lumaire-brown/60 mb-2">Command Center</p>
          <h1 className="text-4xl font-serif text-lumaire-brown">Good Morning, Ismael</h1>
        </div>
        <div className="flex gap-4">
           <Link href="/add-client" className="px-6 py-3 bg-lumaire-brown text-lumaire-ivory font-sans text-sm tracking-wide hover:bg-lumaire-wine transition-colors">+ New Client</Link>
        </div>
      </header>

      {/* 2. HIGH-LEVEL BUSINESS VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Active Weddings</p>
          <p className="font-serif text-4xl">{data.activeWeddings}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Pending Tasks</p>
          <p className="font-serif text-4xl">{data.tasks.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Next Deadline</p>
          <p className="font-serif text-2xl truncate">{data.nextDeadline}</p> 
        </Card>
        <Card>
           <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Est. Revenue</p>
           <p className="font-serif text-4xl">${data.estimatedRevenue.toLocaleString()}</p>
        </Card>
      </div>

      {/* 3. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: INTERACTIVE TASKS */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Today's Tasks">
             {/* This is the new Interactive Component */}
             <TaskList initialTasks={data.tasks} />
            <div className="mt-4 pt-4 text-center border-t border-lumaire-brown/5">
              <button className="text-xs font-bold uppercase tracking-widest hover:text-lumaire-wine transition-colors">View All Tasks →</button>
            </div>
          </Card>
        </div>

        {/* Right Column: MESSAGES & WEDDINGS */}
        <div className="space-y-8">
          <Card title="Upcoming Weddings">
            <div className="space-y-6">
              {data.weddings.map((wedding) => (
                <div key={wedding.id} className="pb-4 border-b border-lumaire-brown/10 last:border-0 last:pb-0">
                  <h4 className="font-serif text-lg">{wedding.partner_1_name} & {wedding.partner_2_name}</h4>
                  <p className="text-sm text-lumaire-brown/60 mb-2">{wedding.wedding_date} • {wedding.venue_name}</p>
                </div>
              ))}
              {data.weddings.length === 0 && <p className="text-sm opacity-50">No upcoming weddings.</p>}
            </div>
          </Card>

          <Card title="Recent Messages">
            <div className="space-y-4">
              {data.messages.length === 0 ? (
                 <p className="text-sm opacity-50">No recent messages.</p>
              ) : (
                data.messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3 items-start">
                    <div className="mt-1 w-6 h-6 flex items-center justify-center bg-lumaire-tan/20 rounded-full text-xs text-lumaire-brown">
                      {msg.type === 'email' ? '✉️' : msg.type === 'call' ? '📞' : '💬'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{msg.partner_1_name}</p>
                      <p className="text-sm text-lumaire-brown/70 leading-relaxed">"{msg.summary}"</p>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">{msg.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>
      </div>
    </main>
  );
}
