'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; // <-- 1. IMPORTAMOS useState

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

  // --- NUEVOS ESTADOS PARA EL MODO EDICIÓN ---
  const [editingId, setEditingId] = useState<number | null>(null); // Guarda el ID del pendiente que se está editando
  const [editTitle, setEditTitle] = useState(''); // Guarda el nuevo título mientras se edita

  // --- FUNCIÓN PARA ENTRAR EN MODO EDICIÓN ---
  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  // --- FUNCIÓN PARA CANCELAR LA EDICIÓN ---
  const handleCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // --- FUNCIÓN PARA GUARDAR LOS CAMBIOS ---
  const handleUpdate = async (id: number) => {
    if (editTitle.trim() === '') return;

    const { error } = await supabase
      .from('todos')
      .update({ title: editTitle })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      alert('Hubo un error al actualizar el pendiente.');
    } else {
      setEditingId(null); // Salimos del modo edición
      router.refresh(); // Refrescamos la tabla
    }
  };

  // --- FUNCIÓN PARA MANEJAR LA ELIMINACIÓN (ya la teníamos) ---
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Límite</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {todos.map((todo) => (
            <tr key={todo.id} className="hover:bg-gray-700">
              {/* --- RENDERIZADO CONDICIONAL: O MODO VISTA O MODO EDICIÓN --- */}
              {editingId === todo.id ? (
                // --- MODO EDICIÓN ---
                <>
                  <td className="px-6 py-4" colSpan={2}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button onClick={() => handleUpdate(todo.id)} className="text-green-400 hover:text-green-300">Guardar</button>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-gray-300">Cancelar</button>
                  </td>
                </>
              ) : (
                // --- MODO VISTA (como estaba antes) ---
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${todo.status === 'terminado' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {todo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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