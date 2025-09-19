'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Definimos el tipo para los datos de los pendientes
type Todo = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
};

export default function TodosTable({ todos }: { todos: Todo[] }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // --- ESTADOS PARA EL MODO EDICIÓN (AHORA CON MÁS CAMPOS) ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // --- FUNCIÓN PARA ENTRAR EN MODO EDICIÓN (ACTUALIZADA) ---
  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.due_date || '');
  };

  // --- FUNCIÓN PARA CANCELAR LA EDICIÓN ---
  const handleCancel = () => {
    setEditingId(null);
  };

  // --- FUNCIÓN PARA GUARDAR LOS CAMBIOS (ACTUALIZADA) ---
  const handleUpdate = async (id: number) => {
    if (editTitle.trim() === '') return;

    const { error } = await supabase
      .from('todos')
      .update({ 
        title: editTitle,
        description: editDescription,
        due_date: editDueDate,
       })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      alert('Hubo un error al actualizar el pendiente.');
    } else {
      setEditingId(null);
      router.refresh();
    }
  };

  // --- FUNCIÓN PARA MANEJAR LA ELIMINACIÓN (sin cambios) ---
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pendiente?')) return;
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg">
        {/* ... (thead sigue igual) ... */}
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título / Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Límite</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {todos.map((todo) => (
            <tr key={todo.id} className="hover:bg-gray-700">
              {editingId === todo.id ? (
                // --- MODO EDICIÓN (ACTUALIZADO CON NUEVOS CAMPOS) ---
                <>
                  <td className="px-6 py-4"></td> {/* Celda vacía para status */}
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button onClick={() => handleUpdate(todo.id)} className="text-green-400 hover:text-green-300">Guardar</button>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-gray-300">Cancelar</button>
                  </td>
                </>
              ) : (
                // --- MODO VISTA ---
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${todo.status === 'terminado' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {todo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{todo.title}</div>
                    {todo.description && <div className="text-sm text-gray-400">{todo.description}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {todo.due_date ? new Date(todo.due_date + 'T00:00:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin fecha'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button onClick={() => handleEdit(todo)} className="text-indigo-400 hover:text-indigo-300">Editar</button>
                    <button onClick={() => handleDelete(todo.id)} className="text-red-400 hover:text-red-300">Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {todos.length === 0 && (
        <p className="text-center py-8 text-gray-400">No se encontraron pendientes.</p>
      )}
    </div>
  );
}