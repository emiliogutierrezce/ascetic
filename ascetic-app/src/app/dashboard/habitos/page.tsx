// app/dashboard/habitos/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function HabitosPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Buscamos TODOS los hábitos del usuario
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Módulo de Hábitos</h1>
      <p>Aquí podrás gestionar tus hábitos diarios.</p>
      {/* Próximamente, aquí irá el componente para mostrar y gestionar los hábitos */}
    </div>
  );
}