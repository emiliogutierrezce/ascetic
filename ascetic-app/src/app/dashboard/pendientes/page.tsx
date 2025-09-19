import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodosTable from '@/app/components/TodosTable';
import CreateTodoForm from '@/app/components/CreateTodoForm';
import NotesList from '@/app/components/NotesList'; // <-- 1. IMPORTAR

export const dynamic = 'force-dynamic';

export default async function PendientesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Búsqueda de Pendientes (sin cambios)
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user?.id)
    .order('due_date', { ascending: true });

  // 2. NUEVA BÚSQUEDA DE NOTAS
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Módulo de Pendientes</h1>
      </div>

      <CreateTodoForm userId={user!.id} />
      <TodosTable todos={todos || []} />

      {/* 3. AÑADIR EL NUEVO COMPONENTE DE NOTAS */}
      <NotesList notes={notes || []} userId={user!.id} />
    </div>
  );
}