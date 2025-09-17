'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Definimos un tipo para los hábitos que recibiremos.
// Incluirá el hábito en sí y si fue completado hoy.
type Habit = {
  id: number;
  title: string;
  completions: { status: string }[];
};

export default function HabitList({ habits }: { habits: Habit[] }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [optimisticHabits, setOptimisticHabits] = useState(habits);

  const handleStatusChange = async (habit: Habit) => {
    const isCompleted = habit.completions.length > 0 && habit.completions[0].status === 'terminado';
    const newStatus = isCompleted ? 'pendiente' : 'terminado';

    // Actualización optimista para una UI instantánea
    setOptimisticHabits(currentHabits =>
      currentHabits.map(h =>
        h.id === habit.id
          ? {
              ...h,
              completions: [{ status: newStatus }],
            }
          : h
      )
    );

    // Si el hábito estaba completado, actualizamos la entrada existente.
    // Si no, insertamos una nueva entrada en habit_completions.
    if (isCompleted) {
      await supabase
        .from('habit_completions')
        .update({ status: newStatus })
        .eq('habit_id', habit.id)
        .eq('completion_date', new Date().toISOString().split('T')[0]);
    } else {
      await supabase.from('habit_completions').insert({
        habit_id: habit.id,
        status: newStatus,
      });
    }

    router.refresh(); // Refresca los datos del servidor
  };

  return (
    <div>
      {optimisticHabits.length > 0 ? (
        <ul className="space-y-3">
          {optimisticHabits.map((habit) => {
            const isCompleted = habit.completions.length > 0 && habit.completions[0].status === 'terminado';
            return (
              <li
                key={habit.id}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleStatusChange(habit)}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  readOnly
                  className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-600"
                />
                <span className={`text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                  {habit.title}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400">Aún no has definido hábitos. ¡Ve al módulo de hábitos para empezar!</p>
      )}
    </div>
  );
}