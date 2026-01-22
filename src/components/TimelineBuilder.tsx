'use client';

import React, { useState } from 'react';

// A single timeline block
interface TimelineItem {
  id: string;
  time: string;
  activity: string;
  notes: string;
}

export function TimelineBuilder() {
  const [items, setItems] = useState<TimelineItem[]>([
    { id: '1', time: '14:00', activity: 'Ceremony Setup Begins', notes: 'Florist arrives' },
    { id: '2', time: '15:30', activity: 'Guests Arrive', notes: 'Music starts' },
    { id: '3', time: '16:00', activity: 'Ceremony Starts', notes: 'Processional' },
  ]);

  const [newItem, setNewItem] = useState({ time: '', activity: '' });

  // Function to add a new event
  const addEvent = () => {
    if (!newItem.time || !newItem.activity) return;
    setItems([...items, { ...newItem, id: Date.now().toString(), notes: '' }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewItem({ time: '', activity: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl text-lumaire-brown">Wedding Day Timeline</h3>
        <button className="text-sm border-b border-lumaire-brown hover:text-lumaire-wine">Export PDF</button>
      </div>

      {/* The Visual Timeline */}
      <div className="relative border-l-2 border-lumaire-tan/30 ml-4 space-y-8 py-4">
        {items.map((item) => (
          <div key={item.id} className="relative pl-8 group">
            {/* The Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-lumaire-tan border-4 border-lumaire-ivory"></div>
            
            {/* The Content */}
            <div className="bg-white p-4 rounded-sm border border-lumaire-tan/20 shadow-sm hover:border-lumaire-brown/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-sans font-bold text-lumaire-brown block mb-1">{item.time}</span>
                  <span className="font-serif text-lg">{item.activity}</span>
                </div>
                <button 
                  onClick={() => setItems(items.filter(i => i.id !== item.id))}
                  className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
              {item.notes && <p className="text-sm text-lumaire-brown/60 mt-2 italic">{item.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Form */}
      <div className="bg-lumaire-tan/10 p-6 rounded-sm">
        <h4 className="font-serif text-lg mb-4">Add Event</h4>
        <div className="flex gap-4">
          <input 
            type="time" 
            value={newItem.time}
            onChange={(e) => setNewItem({...newItem, time: e.target.value})}
            className="p-3 border border-lumaire-brown/20 rounded-sm bg-white"
          />
          <input 
            type="text" 
            placeholder="Activity Name (e.g., Cake Cutting)"
            value={newItem.activity}
            onChange={(e) => setNewItem({...newItem, activity: e.target.value})}
            className="flex-1 p-3 border border-lumaire-brown/20 rounded-sm bg-white"
          />
          <button 
            onClick={addEvent}
            className="px-6 py-3 bg-lumaire-brown text-white rounded-sm hover:bg-lumaire-wine"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
