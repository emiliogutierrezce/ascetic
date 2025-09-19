'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Habit = {
  id: number;
  title: string;
};

export default function HabitsManager({ habits }: { habits: Habit[] }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newHabitTitle.trim() === '') return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('habits').insert({ title: newHabitTitle, user_id: user.id });
    setNewHabitTitle('');
    router.refresh();
  };

  const handleEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditTitle(habit.title);
  };

  const handleUpdate = async (id: number) => {
    if (editTitle.trim() === '') return;
    await supabase.from('habits').update({ title: editTitle }).eq('id', id);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este hábito? Se borrará todo su historial.')) return;
    await supabase.from('habits').delete().eq('id', id);
    router.refresh();
  };

  return (
    <div>
      {/* Formulario de Creación */}
      <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-800 rounded-lg flex gap-2">
        <input
          type="text"
          value={newHabitTitle}
          onChange={(e) => setNewHabitTitle(e.target.value)}
          placeholder="Añadir nuevo hábito..."
          className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Crear Hábito
        </button>
      </form>

      {/* Lista de Hábitos */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
            {editingId === habit.id ? (
              // Modo Edición
              <div className="flex-grow flex gap-2">
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-grow p-2 rounded-md bg-gray-700 text-white border border-gray-600"/>
                <button onClick={() => handleUpdate(habit.id)} className="text-green-400 hover:text-green-300 font-semibold">Guardar</button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">Cancelar</button>
              </div>
            ) : (
              // Modo Vista
              <>
                <p className="text-lg text-white">{habit.title}</p>
                <div className="flex gap-4">
                  <button onClick={() => handleEdit(habit)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Editar</button>
                  <button onClick={() => handleDelete(habit.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
        {habits.length === 0 && (
          <p className="text-center py-8 text-gray-400">No tienes hábitos definidos.</p>
        )}
      </div>
    </div>
  );
}