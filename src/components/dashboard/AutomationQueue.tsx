'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AutomationQueue({ initialQueue }: { initialQueue: any[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState(initialQueue);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'send' | 'dismiss') => {
    setProcessingId(id);
    
    if (action === 'send') {
      const item = queue.find(q => q.id === id);
      if (item) {
        // Open Mail Client
        window.location.href = `mailto:?subject=${encodeURIComponent(item.subject)}&body=${encodeURIComponent(item.body)}`;
      }
    }

    // Mark as handled in DB
    await fetch(`/api/automations/update`, {
      method: 'POST',
      body: JSON.stringify({ id, status: action === 'send' ? 'sent' : 'dismissed' })
    });
    
    setQueue(queue.filter(q => q.id !== id));
    setProcessingId(null);
    router.refresh();
  };

  const runCheck = async () => {
    setProcessingId('checking');
    await fetch('/api/automations/run', { method: 'POST' });
    router.refresh();
    setProcessingId(null);
  };

  if (queue.length === 0) {
    return (
      <div className="bg-white border border-lumaire-tan/20 p-6 text-center">
        <p className="text-sm opacity-50 mb-4">All caught up! No pending automations.</p>
        <button onClick={runCheck} disabled={!!processingId} className="text-xs uppercase font-bold text-lumaire-brown hover:text-lumaire-wine">
          {processingId === 'checking' ? 'Checking...' : 'Check for new Reminders'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-lumaire-tan/20 overflow-hidden">
      <div className="bg-lumaire-tan/10 p-4 flex justify-between items-center border-b border-lumaire-brown/5">
        <h3 className="font-serif text-lumaire-brown">Review Queue ({queue.length})</h3>
        <button onClick={runCheck} className="text-[10px] uppercase font-bold text-lumaire-brown/60 hover:text-lumaire-brown">↻ Refresh</button>
      </div>
      <div>
        {queue.map((item) => (
          <div key={item.id} className="p-4 border-b border-lumaire-brown/5 last:border-0 hover:bg-lumaire-tan/5 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${item.type === 'welcome' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                {item.type.replace('_', ' ')}
              </span>
              <span className="text-[10px] opacity-40">{item.due_date}</span>
            </div>
            <p className="font-bold text-sm text-lumaire-brown mb-1">{item.subject}</p>
            <p className="text-xs text-lumaire-brown/70 line-clamp-2 mb-3 bg-white p-2 border border-lumaire-tan/10 italic">
              {item.body}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(item.id, 'send')}
                disabled={processingId === item.id}
                className="flex-1 bg-lumaire-brown text-white py-2 text-xs uppercase tracking-widest hover:bg-lumaire-wine transition-colors"
              >
                {processingId === item.id ? 'Opening...' : 'Approve & Send'}
              </button>
              <button 
                onClick={() => handleAction(item.id, 'dismiss')}
                disabled={processingId === item.id}
                className="px-4 border border-lumaire-brown/20 text-lumaire-brown text-xs uppercase hover:bg-red-50 hover:text-red-500 hover:border-red-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
