import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección de Pendientes del Día */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pendientes del Día</h2>
          {/* Aquí irá el componente de la lista de pendientes */}
          <p className="text-gray-400">Próximamente...</p>
        </div>

        {/* Sección de Hábitos del Día */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hábitos del Día</h2>
          {/* Aquí irá el componente de la lista de hábitos */}
          <p className="text-gray-400">Próximamente...</p>
        </div>

        {/* Sección de Enfoque */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tiempo de Enfoque</h2>
          {/* Aquí irá el componente del cronómetro */}
          <p className="text-gray-400">Próximamente...</p>
        </div>
      </div>
    </div>
  );
}