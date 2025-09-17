import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodoList from '../components/TodoList';

// Esta línea es importante para que la página siempre cargue los datos más recientes
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Buscar los 'todos' del usuario para el día de hoy
  const { data: todos, error } = await supabase
    .from('todos')
    .select('id, title, description, status')
    .eq('user_id', user?.id)
    .eq('due_date', today);

  if (error) {
    console.error("Error fetching todos:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección de Pendientes del Día */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pendientes del Día</h2>
          <TodoList todos={todos || []} />
        </div>

        {/* Sección de Hábitos del Día */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hábitos del Día</h2>
          <p className="text-gray-400">Próximamente...</p>
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