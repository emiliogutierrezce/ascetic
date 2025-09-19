import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import HabitsManager from '@/app/components/HabitsManager';
import HabitHistory from '@/app/components/HabitHistory'; // <-- 1. IMPORTAR

export const dynamic = 'force-dynamic';

export default async function HabitosPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // --- Búsqueda de Hábitos (sin cambios) ---
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: true });

  // --- 2. LÓGICA PARA EL HISTORIAL ---

  // a) Generar el rango de los últimos 30 días
  const dateRange: string[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dateRange.push(date.toISOString().split('T')[0]);
  }
  dateRange.reverse(); // Ordenar de más antiguo a más reciente

  // b) Buscar todos los registros de compleción en ese rango de fechas
  const { data: completions } = await supabase
    .from('habit_completions')
    .select('habit_id, completion_date, status')
    .eq('user_id', user?.id)
    .in('completion_date', dateRange);

  // c) Procesar y unir los datos para el componente de historial
  const habitsWithHistory = (habits || []).map(habit => {
    const completionsByDate: { [date: string]: boolean } = {};
    dateRange.forEach(date => {
      const completion = completions?.find(c => c.habit_id === habit.id && c.completion_date === date);
      completionsByDate[date] = completion?.status === 'terminado';
    });
    return {
      id: habit.id,
      title: habit.title,
      completionsByDate,
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Módulo de Hábitos</h1>

      <HabitsManager habits={habits || []} />

      {/* 3. AÑADIR EL COMPONENTE DE HISTORIAL */}
      <HabitHistory habits={habitsWithHistory} dateRange={dateRange} />
    </div>
  );
}