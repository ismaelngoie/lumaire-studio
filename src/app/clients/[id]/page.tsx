import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { getRequestContext } from '@cloudflare/next-on-pages';
import NotesWidget from '@/components/clients/NotesWidget';
import TimelineEditor from '@/components/clients/TimelineEditor'; // New
import TaskAdder from '@/components/clients/TaskAdder'; // New

export const runtime = 'edge';

// --- DATA ENGINE ---
async function getClientData(id: string) {
  const { env } = getRequestContext();
  const client = await env.DB.prepare(`SELECT * FROM clients WHERE id = ?`).bind(id).first<any>();
  if (!client) return null;

  const { results: tasks } = await env.DB.prepare(`SELECT * FROM tasks WHERE client_id = ? ORDER BY due_date ASC`).bind(id).all<any>();
  const { results: messages } = await env.DB.prepare(`SELECT * FROM messages WHERE client_id = ? ORDER BY date DESC`).bind(id).all<any>();
  
  // NEW: Fetch Timeline Events
  const { results: timeline } = await env.DB.prepare(`SELECT * FROM timeline_events WHERE client_id = ? ORDER BY start_time ASC`).bind(id).all<any>();

  const totalContract = client.guest_count * 150; 
  const paidAmount = totalContract * 0.4; 

  return { client, tasks, messages, timeline, financials: { totalContract, paidAmount } };
}

export default async function ClientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getClientData(id);

  if (!data) return <div className="p-12 text-center">Client not found.</div>;
  const { client, tasks, messages, timeline, financials } = data;

  return (
    <main className="min-h-screen bg-lumaire-ivory p-8">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8 pb-8 border-b border-lumaire-brown/10">
        <div>
          <Link href="/clients" className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 mb-2 block">← Back to List</Link>
          <h1 className="text-4xl font-serif text-lumaire-brown mb-2">{client.partner_1_name} & {client.partner_2_name}</h1>
          <p className="text-lumaire-brown/60 mb-1">{client.wedding_date} • {client.venue_name} • {client.guest_count} Guests</p>
        </div>
        <div className="flex gap-3">
          <Link href="/add-client" className="px-4 py-2 bg-lumaire-brown text-white text-sm hover:bg-lumaire-wine transition-colors">Documents</Link>
          <Link href="/vendors" className="px-4 py-2 border border-lumaire-brown/20 text-sm hover:bg-lumaire-brown hover:text-white transition-colors">Vendors</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN (4 cols wide) - Context, Notes, Tasks */}
        <div className="lg:col-span-4 space-y-8">
          {/* Notes Widget */}
          <div className="h-64">
             <NotesWidget clientId={client.id} initialNotes={client.notes} />
          </div>

          {/* Tasks Widget */}
          <Card title="Upcoming Tasks">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border border-lumaire-brown ${task.is_completed ? 'bg-lumaire-brown' : ''}`}></div>
                    <span className={`text-sm ${task.is_completed ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                </div>
              ))}
              {tasks.length === 0 && <p className="opacity-50 text-sm italic">No open tasks.</p>}
            </div>
            {/* The Working Add Task Button */}
            <TaskAdder clientId={client.id} />
          </Card>

           {/* Communication Log */}
           <div className="space-y-4">
              <h3 className="font-serif text-xl text-lumaire-brown">Communication</h3>
              {messages.length === 0 ? (
                <div className="p-4 bg-white border border-dashed border-lumaire-brown/20 text-center opacity-50 text-sm">No messages.</div>
              ) : (
                <div className="bg-white border border-lumaire-tan/20 p-4 space-y-4">
                  {messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                       <div className="mt-1 w-5 h-5 rounded-full bg-lumaire-tan/20 flex items-center justify-center text-[10px]">{msg.type === 'email' ? 'E' : 'C'}</div>
                       <div>
                         <p className="text-sm font-medium leading-tight mb-1">{msg.summary}</p>
                         <p className="text-[10px] opacity-40 uppercase">{msg.date}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* RIGHT COLUMN (8 cols wide) - The Timeline */}
        <div className="lg:col-span-8">
           {/* The Interactive Timeline Component */}
           <TimelineEditor clientId={client.id} events={timeline} />
        </div>

      </div>
    </main>
  );
}
