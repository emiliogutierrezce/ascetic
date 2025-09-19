'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTodoForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === '' || dueDate.trim() === '') {
      alert('El título y la fecha son obligatorios.');
      return;
    }

    const { error } = await supabase.from('todos').insert({
      title,
      description,
      due_date: dueDate,
      user_id: userId,
      status: 'pendiente',
    });

    if (!error) {
      setTitle('');
      setDescription('');
      setDueDate('');
      router.refresh();
    } else {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Crear Nuevo Pendiente</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Título */}
        <div className="md:col-span-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {/* Fecha Límite */}
        <div className="md:col-span-1">
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-300 mb-1">Fecha Límite</label>
          <input
            id="due_date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
         {/* Descripción */}
        <div className="md:col-span-3">
           <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción (Opcional)</label>
           <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="mt-4 text-right">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Guardar Pendiente
        </button>
      </div>
    </form>
  );
}