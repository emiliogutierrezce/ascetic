'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Note = {
  id: number;
  title: string;
  description: string | null;
};

export default function NotesList({ notes, userId }: { notes: Note[], userId: string }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Estados para el modo edición
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditDescription(note.description || '');
  };

  const handleUpdate = async (id: number) => {
    if (editTitle.trim() === '') return;
    await supabase.from('notes').update({ title: editTitle, description: editDescription }).eq('id', id);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta nota?')) return;
    await supabase.from('notes').delete().eq('id', id);
    router.refresh();
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Puntos para Tener en Mente</h2>

      {/* Lista de Notas */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 bg-gray-800 rounded-lg">
            {editingId === note.id ? (
              // Modo Edición
              <div>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"/>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"/>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(note.id)} className="text-green-400 hover:text-green-300">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">Cancelar</button>
                </div>
              </div>
            ) : (
              // Modo Vista
              <div>
                <h3 className="font-bold text-lg text-white">{note.title}</h3>
                <p className="text-gray-400">{note.description}</p>
                <div className="flex gap-4 mt-2">
                  <button onClick={() => handleEdit(note)} className="text-indigo-400 hover:text-indigo-300 text-sm">Editar</button>
                  <button onClick={() => handleDelete(note.id)} className="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
                </div>
              </div>
            )}
          </div>
        ))}
         {notes.length === 0 && (
            <p className="text-center py-8 text-gray-400">No tienes puntos guardados.</p>
         )}
      </div>
    </div>
  );
}