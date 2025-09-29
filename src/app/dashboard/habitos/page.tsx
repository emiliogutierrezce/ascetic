import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import HabitsManager from '@/app/components/HabitsManager';

export const dynamic = 'force-dynamic';

export default async function HabitosPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // --- Búsqueda de Hábitos ---
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Módulo de Hábitos</h1>

      <HabitsManager habits={habits || []} />

    </div>
  );
}