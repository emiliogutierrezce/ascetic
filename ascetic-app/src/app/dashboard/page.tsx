import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import HabitList from '../components/HabitList';
import FocusTimer from '../components/FocusTimer';
import WeeklySummary from '../components/WeeklySummary';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // --- LÓGICA PARA EL RESUMEN SEMANAL ---
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const todayStr = today.toISOString().split('T')[0];
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const { count: totalHabitDefinitions } = await supabase.from('habits').select('*', { count: 'exact', head: true }).eq('user_id', user!.id);
  const totalPossibleHabits = (totalHabitDefinitions || 0) * 7;
  const { data: habitCompletions } = await supabase.from('habit_completions').select('status').eq('user_id', user!.id).gte('completion_date', sevenDaysAgoStr).lte('completion_date', todayStr);
  const completedHabits = habitCompletions?.filter(c => c.status === 'terminado').length || 0;

  const { data: todosInWeek } = await supabase.from('todos').select('status').eq('user_id', user!.id).gte('due_date', sevenDaysAgoStr).lte('due_date', todayStr);
  const totalTodosInWeek = todosInWeek?.length || 0;
  const completedTodosInWeek = todosInWeek?.filter(t => t.status === 'terminado').length || 0;
  
  // --- Búsquedas para los paneles del día ---
  const { data: todosToday } = await supabase.from('todos').select('id, title, description, status').eq('user_id', user?.id).eq('due_date', todayStr);
  const { data: habitsToday } = await supabase.from('habits').select(`id, title, completions:habit_completions (status)`).eq('user_id', user?.id).eq('completions.completion_date', todayStr);
  const { data: focusLog } = await supabase.from('focus_logs').select('duration_seconds').eq('user_id', user?.id).eq('log_date', todayStr).single();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
      </h1>
      <WeeklySummary
        completedTodos={completedTodosInWeek}
        totalTodos={totalTodosInWeek}
        completedHabits={completedHabits}
        totalHabits={totalPossibleHabits}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pendientes del Día</h2>
          <AddTodoForm userId={user!.id} />
          <TodoList todos={todosToday || []} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hábitos del Día</h2>
          <HabitList habits={habitsToday || []} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Tiempo de Enfoque</h2>
          <div className="flex-grow flex items-center justify-center">
            <FocusTimer userId={user!.id} initialDuration={focusLog?.duration_seconds || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}