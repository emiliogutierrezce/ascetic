'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Tipado para los 'todos' que vienen de la base de datos
type Todo = {
  id: number;
  title: string;
  description: string | null;
  status: string;
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [optimisticTodos, setOptimisticTodos] = useState(todos);

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'pendiente' ? 'terminado' : 'pendiente';

    // Actualización optimista: Actualiza la UI inmediatamente
    setOptimisticTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );

    // Llama a la base de datos para actualizar el registro real
    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      // Si hay un error, revierte la actualización optimista
      setOptimisticTodos(todos);
    } else {
      // Refresca los datos del servidor para asegurar consistencia
      router.refresh();
    }
  };

  return (
    <div>
      {optimisticTodos.length > 0 ? (
        <ul className="space-y-3">
          {optimisticTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={() => handleStatusChange(todo.id, todo.status)}
            >
              <input
                type="checkbox"
                checked={todo.status === 'terminado'}
                readOnly
                className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-indigo-500 focus:ring-indigo-600"
              />
              <span className={`text-lg ${todo.status === 'terminado' ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No tienes pendientes para hoy. ¡Añade uno!</p>
      )}
    </div>
  );
}