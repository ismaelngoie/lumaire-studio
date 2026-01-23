import React from 'react';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

async function getTimeline(id: string) {
  const { env } = getRequestContext();
  const client = await env.DB.prepare(`SELECT * FROM clients WHERE id = ?`).bind(id).first<any>();
  const { results: timeline } = await env.DB.prepare(`SELECT * FROM timeline_events WHERE client_id = ? ORDER BY start_time ASC`).bind(id).all<any>();
  return { client, timeline };
}

export default async function PublicTimeline({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getTimeline(id);
  
  if (!data.client) return <div className="p-12 text-center font-serif">Timeline not found.</div>;

  return (
    <main className="min-h-screen bg-lumaire-ivory p-8 md:p-12 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-lumaire-brown/60 mb-4">Official Timeline</p>
        <h1 className="font-serif text-5xl text-lumaire-brown mb-4">{data.client.partner_1_name} & {data.client.partner_2_name}</h1>
        <p className="text-lg text-lumaire-brown/80">{data.client.wedding_date} • {data.client.venue_name}</p>
      </div>

      <div className="relative border-l border-lumaire-brown/20 ml-6 space-y-12 pl-8 py-2">
        {data.timeline.map((evt: any) => (
          <div key={evt.id} className="relative">
             <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-lumaire-brown border-4 border-lumaire-ivory"></div>
             <div>
               <span className="block font-sans font-bold text-lumaire-brown text-lg mb-1">{evt.start_time}</span>
               <h3 className="font-serif text-2xl text-lumaire-brown mb-1">{evt.activity}</h3>
               {evt.notes && <p className="text-lumaire-brown/60 italic font-serif">{evt.notes}</p>}
             </div>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-center border-t border-lumaire-brown/10 pt-8">
        <p className="text-xs uppercase tracking-widest opacity-40">Planned with Lumaire Studio</p>
      </footer>
    </main>
  );
}
