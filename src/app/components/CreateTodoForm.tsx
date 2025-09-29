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
  const [dueTime, setDueTime] = useState(''); // <-- NUEVO ESTADO PARA LA HORA

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === '' || dueDate.trim() === '') {
      alert('El título y la fecha son obligatorios.');
      return;
    }

    await supabase.from('todos').insert({
      title,
      description,
      due_date: dueDate,
      due_time: dueTime || null, // <-- AÑADIR HORA (O NULL SI ESTÁ VACÍO)
      user_id: userId,
      status: 'pendiente',
    });

    // Limpiar formulario
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Crear Nuevo Pendiente</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Ajustamos a 4 columnas */}
        {/* Título */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Título</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600" required />
        </div>
        {/* Fecha Límite */}
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-300 mb-1">Fecha Límite</label>
          <input id="due_date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600" required />
        </div>
        {/* Hora (Opcional) */}
        <div>
          <label htmlFor="due_time" className="block text-sm font-medium text-gray-300 mb-1">Hora (Opcional)</label>
          <input id="due_time" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600" />
        </div>
         {/* Descripción */}
        <div className="md:col-span-4">
           <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción (Opcional)</label>
           <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600" />
        </div>
      </div>
      <div className="mt-4 text-right">
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Guardar Pendiente
        </button>
      </div>
    </form>
  );
}