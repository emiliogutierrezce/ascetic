import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
      <p>Aquí se mostrará la lista completa de tus pendientes.</p>
      {/* Próximamente, aquí irá el componente para mostrar la tabla de pendientes */}
    </div>
  );
}