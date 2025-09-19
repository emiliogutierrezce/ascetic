import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import HabitList from '../components/HabitList';
import FocusTimer from '../components/FocusTimer'; 

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split('T')[0];

  // --- Búsqueda de Pendientes ---
  const { data: todos } = await supabase
    .from('todos')
    .select('id, title, description, status')
    .eq('user_id', user?.id)
    .eq('due_date', today);

  // --- Búsqueda de Hábitos ---
  const { data: habits } = await supabase
    .from('habits')
    .select(`id, title, completions:habit_completions (status)`)
    .eq('user_id', user?.id)
    .eq('completions.completion_date', today);

  // --- Búsqueda de Tiempo de Enfoque ---
  const { data: focusLog } = await supabase
    .from('focus_logs')
    .select('duration_seconds')
    .eq('user_id', user?.id)
    .eq('log_date', today)
    .single();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección de Pendientes */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pendientes del Día</h2>
          <AddTodoForm userId={user!.id} />
          <TodoList todos={todos || []} />
        </div>

        {/* Sección de Hábitos */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hábitos del Día</h2>
          <HabitList habits={habits || []} />
        </div>

        {/* Sección de Enfoque */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Tiempo de Enfoque</h2>
          <div className="flex-grow flex items-center justify-center">
            <FocusTimer
              userId={user!.id}
              initialDuration={focusLog?.duration_seconds || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}