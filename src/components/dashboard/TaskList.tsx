'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskList({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const router = useRouter();

  const toggleTask = async (taskId: string, currentStatus: number) => {
    // 1. Optimistic UI Update (Immediate feedback)
    const newStatus = currentStatus === 0 ? 1 : 0;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: newStatus } : t));

    // 2. Send to API
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_completed: newStatus })
      });
      router.refresh(); // Refresh server data to stay in sync
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  if (tasks.filter(t => t.is_completed === 0).length === 0) {
    return <p className="text-sm opacity-50 italic py-4">No urgent tasks. You are all caught up!</p>;
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          onClick={() => toggleTask(task.id, task.is_completed)}
          className={`flex items-center group cursor-pointer p-3 rounded-sm transition-all border-b border-lumaire-brown/5 last:border-0 hover:bg-lumaire-tan/10 ${task.is_completed ? 'opacity-50' : ''}`}
        >
          {/* Custom Checkbox UI */}
          <div className={`w-5 h-5 border rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-colors ${task.is_completed ? 'bg-lumaire-brown border-lumaire-brown' : 'border-lumaire-brown'}`}>
            {task.is_completed && <span className="text-white text-xs">✓</span>}
          </div>
          
          <div className="flex-1">
            <p className={`font-medium text-lumaire-brown transition-all ${task.is_completed ? 'line-through opacity-70' : ''}`}>
              {task.title}
            </p>
            <div className="flex gap-3 mt-1">
               <span className="text-xs opacity-50 uppercase tracking-wide">{task.category}</span>
               <span className="text-xs opacity-50">• Due {task.due_date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
