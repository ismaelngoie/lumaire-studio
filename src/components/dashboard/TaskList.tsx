'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskList({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Toggle Completion
  const toggleTask = async (taskId: string, currentStatus: number) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: newStatus } : t));
    await fetch(`/api/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify({ is_completed: newStatus }) });
    router.refresh();
  };

  // Delete Task
  const deleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from triggering toggle
    if(!confirm("Delete this task?")) return;
    
    setTasks(tasks.filter(t => t.id !== taskId)); // Optimistic remove
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    router.refresh();
  };

  // Save Edits (Title change)
  const saveEdit = async (task: any, newTitle: string) => {
    setEditingId(null);
    if(task.title === newTitle) return;
    
    setTasks(tasks.map(t => t.id === task.id ? { ...t, title: newTitle } : t));
    await fetch(`/api/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ title: newTitle }) });
    router.refresh();
  };

  if (tasks.filter(t => t.is_completed === 0).length === 0) {
    return <p className="text-sm opacity-50 italic py-4">No urgent tasks.</p>;
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <div key={task.id} className={`flex items-center group p-3 rounded-sm transition-all border-b border-lumaire-brown/5 last:border-0 hover:bg-lumaire-tan/10 ${task.is_completed ? 'opacity-50' : ''}`}>
          
          {/* Checkbox */}
          <div onClick={() => toggleTask(task.id, task.is_completed)} className={`cursor-pointer w-5 h-5 border rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-colors ${task.is_completed ? 'bg-lumaire-brown border-lumaire-brown' : 'border-lumaire-brown'}`}>
            {task.is_completed && <span className="text-white text-xs">✓</span>}
          </div>
          
          {/* Editable Content */}
          <div className="flex-1">
            {editingId === task.id ? (
              <input 
                autoFocus
                className="w-full bg-white border border-lumaire-brown/20 p-1 text-sm outline-none"
                defaultValue={task.title}
                onBlur={(e) => saveEdit(task, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(task, e.currentTarget.value)}
              />
            ) : (
              <p 
                onClick={() => setEditingId(task.id)}
                className={`font-medium text-lumaire-brown cursor-text hover:text-lumaire-wine transition-all ${task.is_completed ? 'line-through opacity-70' : ''}`}
                title="Click to edit text"
              >
                {task.title}
              </p>
            )}
            <div className="flex gap-3 mt-1">
               <span className="text-xs opacity-50 uppercase tracking-wide">{task.category}</span>
               <span className="text-xs opacity-50">• Due {task.due_date}</span>
            </div>
          </div>

          {/* Delete Button (Visible on Hover) */}
          <button 
            onClick={(e) => deleteTask(task.id, e)}
            className="text-lumaire-brown/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all px-2 font-bold text-lg"
            title="Delete Task"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
