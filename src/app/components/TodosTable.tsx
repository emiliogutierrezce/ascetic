'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Todo = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  status: string;
};

export default function TodosTable({ todos }: { todos: Todo[] }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.due_date || '');
    setEditDueTime(todo.due_time || '');
  };

  const handleUpdate = async (id: number) => {
    if (editTitle.trim() === '') return;

    await supabase
      .from('todos')
      .update({
        title: editTitle,
        description: editDescription,
        due_date: editDueDate,
        due_time: editDueTime || null,
      })
      .eq('id', id);

    setEditingId(null);
    router.refresh();
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pendiente?')) return;
    await supabase.from('todos').delete().eq('id', id);
    router.refresh();
  };

  const inputStyles = "block w-full rounded-md border-0 bg-white/5 p-2 text-gray-50 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6";

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Fecha Límite</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {todos.map((todo) => (
              <tr key={todo.id} className="transition-colors hover:bg-gray-800/50">
                {editingId === todo.id ? (
                  // --- MODO EDICIÓN ---
                  <td colSpan={4} className="p-4">
                    <div className="space-y-4">
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputStyles} />
                      <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} className={inputStyles} />
                      <div className="flex gap-4">
                        <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className={inputStyles} />
                        <input type="time" value={editDueTime} onChange={(e) => setEditDueTime(e.target.value)} className={inputStyles} />
                      </div>
                      <div className="flex justify-end gap-4">
                        <button onClick={handleCancel} className="rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200">Cancelar</button>
                        <button onClick={() => handleUpdate(todo.id)} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Guardar Cambios</button>
                      </div>
                    </div>
                  </td>
                ) : (
                  // --- MODO VISTA ---
                  <>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${todo.status === 'terminado' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {todo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-50">{todo.title}</div>
                      {todo.description && <div className="mt-1 text-gray-400">{todo.description}</div>}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                      <div>{todo.due_date ? new Date(todo.due_date + 'T00:00:00').toLocaleDateString('es-MX', { month: 'long', day: 'numeric' }) : 'Sin fecha'}</div>
                      {todo.due_time && <div className="text-xs text-gray-500">{todo.due_time}</div>}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button onClick={() => handleEdit(todo)} className="text-indigo-400 transition-colors hover:text-indigo-300">Editar</button>
                      <button onClick={() => handleDelete(todo.id)} className="ml-4 text-red-500 transition-colors hover:text-red-400">Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {todos.length === 0 && (
          <div className="flex items-center justify-center p-10">
            <p className="text-center text-sm text-gray-500">No se encontraron pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
