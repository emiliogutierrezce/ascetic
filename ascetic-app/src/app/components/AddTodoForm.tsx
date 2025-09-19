'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Recibimos el user_id como una propiedad desde la página del dashboard
export default function AddTodoForm({ userId }: { userId: string }) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '') return;

    const { error } = await supabase.from('todos').insert({
      title: newTodoTitle,
      user_id: userId,
      due_date: new Date().toISOString().split('T')[0], // Fecha de hoy
      status: 'pendiente',
    });

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setNewTodoTitle(''); // Limpia el input
      router.refresh(); // Refresca los datos del servidor para mostrar la nueva tarea
    }
  };

  return (
    <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Añadir nuevo pendiente..."
        className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        Añadir
      </button>
    </form>
  );
}