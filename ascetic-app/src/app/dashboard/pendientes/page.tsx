import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodosTable from '@/app/components/TodosTable';
import CreateTodoForm from '@/app/components/CreateTodoForm'; // <-- 1. IMPORTAR

export const dynamic = 'force-dynamic';

export default async function PendientesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Buscamos TODOS los pendientes del usuario, ordenados por fecha [cite: 17]
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Módulo de Pendientes</h1>
      </div>

      {/* 2. AÑADIR EL NUEVO FORMULARIO */}
      <CreateTodoForm userId={user!.id} />

      <TodosTable todos={todos || []} />
    </div>
  );
}