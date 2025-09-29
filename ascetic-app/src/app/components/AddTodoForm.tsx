'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getTodayInMexicoCity } from '../../../lib/date';

// Recibimos el user_id como una propiedad desde la página del dashboard
export default function AddTodoForm({ userId }: { userId: string }) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const supabase = createClientComponentClient();

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '') return;

    const { error } = await supabase.from('todos').insert({
      title: newTodoTitle,
      user_id: userId,
      due_date: getTodayInMexicoCity(), // Use centralized date function
      status: 'pendiente',
    });

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setNewTodoTitle(''); // Limpia el input
    }
  };

  return (
    <form onSubmit={handleAddTask} className="flex items-center gap-3 mb-6">
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Añadir nuevo pendiente para hoy..."
        className="h-10 w-full flex-grow rounded-md border border-slate-700/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 ring-offset-slate-950 transition-colors hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Añadir
      </button>
    </form>
  );
}