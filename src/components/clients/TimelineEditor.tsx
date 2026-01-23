'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TimelineEditor({ clientId, events }: { clientId: string, events: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({ start_time: '', activity: '' });
  
  // Track which item is being edited
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add Event
  const addEvent = async () => {
    if (!newEvent.start_time || !newEvent.activity) return;
    setLoading(true);
    await fetch('/api/timeline', {
      method: 'POST',
      body: JSON.stringify({ ...newEvent, client_id: clientId })
    });
    setNewEvent({ start_time: '', activity: '' });
    setLoading(false);
    router.refresh();
  };

  // Delete Event
  const removeEvent = async (id: string) => {
    if(!confirm("Remove this event?")) return;
    await fetch(`/api/timeline/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  // Save Edits (Time or Activity)
  const updateEvent = async (id: string, field: 'start_time' | 'activity', value: string) => {
    await fetch(`/api/timeline/${id}`, { 
      method: 'PATCH', 
      body: JSON.stringify({ [field]: value }) 
    });
    router.refresh();
  };

  const loadTemplate = async () => {
    if(!confirm("Load template?")) return;
    setLoading(true);
    await fetch('/api/timeline/template', { method: 'POST', body: JSON.stringify({ client_id: clientId }) });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h2 className="font-serif text-3xl text-lumaire-brown">Wedding Day Timeline</h2>
        <div className="flex gap-3">
          {events.length === 0 && (
             <button onClick={loadTemplate} className="text-xs uppercase tracking-widest border border-lumaire-brown/30 px-3 py-1 hover:bg-lumaire-brown hover:text-white transition-colors">
               + Load Template
             </button>
          )}
          <button onClick={() => window.open(`/share/${clientId}`, '_blank')} className="text-xs uppercase tracking-widest bg-lumaire-brown text-white px-3 py-1 hover:bg-lumaire-wine transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* TIMELINE VISUALIZATION */}
      <div className="relative border-l-2 border-lumaire-tan/30 ml-3 space-y-8 pl-8 py-2">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-lumaire-tan border-4 border-lumaire-ivory shadow-sm"></div>
            
            <div className="bg-white p-6 border border-lumaire-tan/20 shadow-sm relative hover:border-lumaire-brown/30 transition-colors group">
              
              {/* EDITABLE TIME */}
              <input 
                type="time" 
                defaultValue={evt.start_time}
                onBlur={(e) => updateEvent(evt.id, 'start_time', e.target.value)}
                className="block font-bold text-lumaire-brown mb-1 bg-transparent border-b border-transparent hover:border-lumaire-brown/20 focus:border-lumaire-brown outline-none transition-colors cursor-pointer"
              />

              {/* EDITABLE ACTIVITY */}
              <input 
                defaultValue={evt.activity}
                onBlur={(e) => updateEvent(evt.id, 'activity', e.target.value)}
                className="w-full text-lg font-serif text-lumaire-brown/90 bg-transparent border-b border-transparent hover:border-lumaire-brown/20 focus:border-lumaire-brown outline-none transition-colors"
              />
              
              {/* REMOVE BUTTON */}
              <button 
                onClick={() => removeEvent(evt.id)}
                className="absolute top-4 right-4 text-[10px] text-red-400 opacity-0 group-hover:opacity-100 uppercase tracking-widest hover:text-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="opacity-40 italic">No events planned yet.</p>}
      </div>

      {/* ADD EVENT FORM */}
      <div className="bg-lumaire-tan/10 p-6 rounded-sm mt-8">
        <h4 className="font-serif text-lg text-lumaire-brown mb-4">Add Event</h4>
        <div className="flex gap-4">
          <input type="time" className="p-3 border border-lumaire-tan/20 w-32 bg-white" value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} />
          <input type="text" placeholder="Activity Name" className="flex-1 p-3 border border-lumaire-tan/20 bg-white" value={newEvent.activity} onChange={e => setNewEvent({...newEvent, activity: e.target.value})} />
          <button onClick={addEvent} disabled={loading} className="bg-lumaire-brown text-white px-6 py-3 text-sm hover:bg-lumaire-wine transition-colors">{loading ? '...' : 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
