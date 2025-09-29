import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TodosTable from '@/app/components/TodosTable';
import CreateTodoForm from '@/app/components/CreateTodoForm';
import CreateNoteForm from '@/app/components/CreateNoteForm'; // <-- Import new form
import NotesList from '@/app/components/NotesList';

export const dynamic = 'force-dynamic';

export default async function PendientesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Búsqueda de Pendientes
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user?.id)
    .order('due_date', { ascending: true });

  // Búsqueda de Notas
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <CreateTodoForm userId={user!.id} />
        <CreateNoteForm userId={user!.id} />
      </div>
      
      <TodosTable todos={todos || []} />

      <NotesList notes={notes || []} userId={user!.id} />
    </div>
  );
}