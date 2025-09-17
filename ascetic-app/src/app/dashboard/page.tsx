import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import HabitList from '../components/HabitList'; // <-- 1. IMPORTAR

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split('T')[0];

  // --- Búsqueda de Pendientes (ya la teníamos) ---
  const { data: todos } = await supabase
    .from('todos')
    .select('id, title, description, status')
    .eq('user_id', user?.id)
    .eq('due_date', today);

  // --- 2. NUEVA BÚSQUEDA DE HÁBITOS ---
  // Buscamos todos los hábitos del usuario y, para cada uno, buscamos si tiene
  // un registro de compleción para el día de hoy.
  const { data: habits } = await supabase
    .from('habits')
    .select(`
      id,
      title,
      completions:habit_completions (
        status
      )
    `)
    .eq('user_id', user?.id)
    .eq('completions.completion_date', today);


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección de Pendientes del Día */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pendientes del Día</h2>
          <AddTodoForm userId={user!.id} />
          <TodoList todos={todos || []} />
        </div>

        {/* Sección de Hábitos del Día */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hábitos del Día</h2>
          {/* 3. AÑADIR LA LISTA DE HÁBITOS */}
          <HabitList habits={habits || []} />
        </div>

        {/* Sección de Enfoque */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tiempo de Enfoque</h2>
          <p className="text-gray-400">Próximamente...</p>
        </div>
      </div>
    </div>
  );
}