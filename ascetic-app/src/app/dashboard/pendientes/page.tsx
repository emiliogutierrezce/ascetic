import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodosTable from '@/app/components/TodosTable'; // Usamos el alias '@/' para una ruta más limpia

export const dynamic = 'force-dynamic';

export default async function PendientesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Buscamos TODOS los pendientes del usuario, ordenados por fecha
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user?.id)
    .order('due_date', { ascending: true });

  if (error) {
    console.error("Error fetching todos:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Módulo de Pendientes</h1>
      {/* Reemplazamos el párrafo con nuestro nuevo componente de tabla */}
      <TodosTable todos={todos || []} />
    </div>
  );
}