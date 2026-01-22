import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

// Mock Data (Placeholder until we connect the DB)
const clients = [
  { id: '1', couple: 'Sarah & James', date: '2026-10-12', status: 'Active', venue: 'The Grand Hotel', email: 'sarah@example.com' },
  { id: '2', couple: 'Elena & Michael', date: '2026-11-04', status: 'Onboarding', venue: 'Seaside Pavilion', email: 'elena@example.com' },
  { id: '3', couple: 'David & Tom', date: '2026-12-15', status: 'Planning', venue: 'City Loft', email: 'david@example.com' },
];

export default function ClientList() {
  return (
    <main className="min-h-screen bg-lumaire-ivory p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
           <Link href="/dashboard" className="text-sm text-lumaire-brown/60 hover:text-lumaire-brown mb-2 block">← Back to Dashboard</Link>
           <h1 className="text-4xl font-serif text-lumaire-brown">Clients</h1>
        </div>
        <button className="px-6 py-3 bg-lumaire-brown text-lumaire-ivory font-sans text-sm tracking-wide hover:bg-lumaire-wine transition-colors">
          + Add Couple
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {clients.map((client) => (
          <Link key={client.id} href={`/clients/${client.id}`}>
            <Card className="hover:border-lumaire-tan transition-colors cursor-pointer group">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-2xl text-lumaire-brown group-hover:text-lumaire-wine transition-colors">{client.couple}</h3>
                  <p className="text-lumaire-brown/60 mt-1">{client.venue} • {client.date}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-lumaire-tan/20 rounded-full text-xs uppercase tracking-widest text-lumaire-brown mb-2">
                    {client.status}
                  </span>
                  <p className="text-sm opacity-50">{client.email}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
