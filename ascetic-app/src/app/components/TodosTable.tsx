'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORTAMOS useRouter

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
  const router = useRouter(); // <-- 2. INICIALIZAMOS useRouter

  // 3. FUNCIÓN PARA MANEJAR LA ELIMINACIÓN
  const handleDelete = async (id: number) => {
    // Pedimos confirmación antes de borrar
    if (!confirm('¿Estás seguro de que quieres eliminar este pendiente?')) {
      return;
    }

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      alert('Hubo un error al eliminar el pendiente.');
    } else {
      // Refresca los datos de la página para que la tabla se actualice
      router.refresh();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg">
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  todo.status === 'terminado'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
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
                {/* 4. BOTONES DE ACCIONES */}
                <button className="text-indigo-400 hover:text-indigo-300">Editar</button>
                <button 
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Eliminar
                </button>
              </td>
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