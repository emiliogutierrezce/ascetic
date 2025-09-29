'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateNoteForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTitle.trim() === '') return;

    await supabase.from('notes').insert({ title: newTitle, description: newDescription, user_id: userId });
    setNewTitle('');
    setNewDescription('');
    router.refresh();
  };

  return (
    <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Puntos para Tener en Mente</h2>
        <form onSubmit={handleCreate} className="p-6 bg-gray-800 rounded-lg">
            <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nuevo punto..."
            className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"
            required
            />
            <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción (opcional)..."
            rows={2}
            className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Añadir Punto
            </button>
        </form>
    </div>
  );
}
