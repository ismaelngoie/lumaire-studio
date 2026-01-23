import React from 'react';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export default async function PublicTimeline({ params }: { params: Promise<{ id: string }> }) {
  const { env } = getRequestContext();
  const { id } = await params;

  // Fetch Client & Timeline Data
  const client = await env.DB.prepare(`SELECT * FROM clients WHERE id = ?`).bind(id).first<any>();
  const { results: events } = await env.DB.prepare(`SELECT * FROM timeline_events WHERE client_id = ? ORDER BY start_time ASC`).bind(id).all<any>();

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center bg-lumaire-ivory text-lumaire-brown font-serif">
        Timeline not found or expired.
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-lumaire-brown py-20 px-6 md:px-0">
        {/* ELEGANT HEADER */}
        <div className="text-center mb-24 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] opacity-60">Official Wedding Timeline</p>
            <h1 className="font-serif text-5xl md:text-8xl">{client.partner_1_name} & {client.partner_2_name}</h1>
            <p className="font-serif text-xl md:text-2xl opacity-80">{client.wedding_date} • {client.venue_name}</p>
        </div>

        {/* TIMELINE VISUALIZATION */}
        <div className="max-w-3xl mx-auto relative">
            {/* The Vertical Line */}
            <div className="absolute left-[80px] md:left-[120px] top-4 bottom-0 w-px bg-lumaire-brown/20"></div>

            <div className="space-y-16">
                {events.map((evt: any) => (
                    <div key={evt.id} className="relative flex items-baseline group">
                        
                        {/* Time (Left) */}
                        <div className="w-[80px] md:w-[120px] text-right pr-8 md:pr-12 font-bold text-lg md:text-xl opacity-80">
                            {evt.start_time}
                        </div>
                        
                        {/* The Dot */}
                        <div className="absolute left-[76px] md:left-[116px] top-2 w-[9px] h-[9px] bg-lumaire-brown rounded-full ring-4 ring-white"></div>

                        {/* Content (Right) */}
                        <div className="flex-1 pl-8 md:pl-12 pt-1">
                            <h3 className="font-serif text-3xl md:text-4xl leading-tight">{evt.activity}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-32 pt-12 border-t border-lumaire-brown/10 max-w-xl mx-auto">
            <p className="text-[10px] uppercase tracking-widest opacity-40">Planned with Lumaire Studio</p>
        </div>
    </main>
  );
}
