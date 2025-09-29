'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import CheckIcon from './icons/CheckIcon';

// Tipado para los 'todos' que vienen de la base de datos
type Todo = {
  id: number;
  title: string;
  description: string | null;
  status: string;
};

type TodoListProps = {
  todos: Todo[];
  onTodoUpdate: (newStatus: string) => void;
};

export default function TodoList({ todos, onTodoUpdate }: TodoListProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [optimisticTodos, setOptimisticTodos] = useState(todos);

  useEffect(() => {
    setOptimisticTodos(todos);
  }, [todos]);

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'pendiente' ? 'terminado' : 'pendiente';

    setOptimisticTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );

    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      onTodoUpdate(newStatus);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este pendiente?')) return;

    // Optimistic delete
    setOptimisticTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      // Revert optimistic update on error
      setOptimisticTodos(todos);
      alert('Error al eliminar el pendiente.');
    } else {
      // No need to call onTodoUpdate, just refresh for simplicity
      router.refresh();
    }
  };

  return (
    <div className="mt-4 w-full">
      {optimisticTodos.length > 0 ? (
        <ul className="space-y-3">
          {optimisticTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:bg-slate-800/50"
            >
              <div 
                className="flex items-center gap-3 cursor-pointer flex-grow"
                onClick={() => handleStatusChange(todo.id, todo.status)}
              >
                <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border-2 transition-colors ${todo.status === 'terminado' ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}>
                  {todo.status === 'terminado' && <CheckIcon className="h-3 w-3 text-slate-950" />}
                </div>
                <span className={`text-sm font-medium ${todo.status === 'terminado' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                  {todo.title}
                </span>
              </div>
              <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:text-red-400 text-xs font-semibold">ELIMINAR</button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-700/80">
          <p className="text-sm text-slate-500">No tienes pendientes para hoy. ¡Añade uno!</p>
        </div>
      )}
    </div>
  );
}
