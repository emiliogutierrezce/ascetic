// app/dashboard/enfoque/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function EnfoquePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Buscamos TODOS los registros de enfoque del usuario, ordenados por fecha descendente
  const { data: focusLogs, error } = await supabase
    .from('focus_logs')
    .select('*')
    .eq('user_id', user?.id)
    .order('log_date', { ascending: false });

  if (error) {
    console.error("Error fetching focus logs:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Módulo de Enfoque</h1>
      <p>Aquí se mostrará tu historial de tiempo de enfoque por día.</p>
      {/* Próximamente, aquí irá el componente para mostrar y editar los registros */}
    </div>
  );
}