import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import FocusHistory from '@/app/components/FocusHistory'; // <-- 1. IMPORTAR

export const dynamic = 'force-dynamic';

export default async function EnfoquePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: focusLogs } = await supabase
    .from('focus_logs')
    .select('*')
    .eq('user_id', user?.id)
    .order('log_date', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Módulo de Enfoque</h1>

      {/* 2. USAR EL NUEVO COMPONENTE */}
      <FocusHistory logs={focusLogs || []} />
    </div>
  );
}