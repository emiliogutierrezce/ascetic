'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { getTodayInMexicoCity } from '../../../lib/date';
import CheckIcon from './icons/CheckIcon';

// This type now matches the shape provided by DashboardClient
type Habit = {
  id: number;
  title: string;
  user_id: string;
  status: string; 
};

type HabitListProps = {
  habits: Habit[];
  userId: string;
  onHabitUpdate: (newStatus: string) => void; // <-- Matches TodoList
};

export default function HabitList({ habits, userId, onHabitUpdate }: HabitListProps) {
  const supabase = createClientComponentClient();
  const [optimisticHabits, setOptimisticHabits] = useState(habits);

  useEffect(() => {
    setOptimisticHabits(habits);
  }, [habits]);

  // This logic is now identical to TodoList's handler
  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'pendiente' ? 'terminado' : 'pendiente';

    // Optimistic UI update
    setOptimisticHabits(currentHabits =>
      currentHabits.map(h => (h.id === id ? { ...h, status: newStatus } : h))
    );

    // Perform the actual database operation in the background
    let error;
    if (newStatus === 'terminado') {
      const { error: insertError } = await supabase.from('habit_completions').insert({
        habit_id: id,
        status: newStatus,
        completion_date: getTodayInMexicoCity(),
        user_id: userId,
      });
      error = insertError;
    } else {
      const { error: deleteError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', id)
        .eq('completion_date', getTodayInMexicoCity());
      error = deleteError;
    }

    // If the DB operation is successful, call the parent handler
    if (!error) {
      onHabitUpdate(newStatus);
    }
    // Note: We are not reverting the optimistic update on error for simplicity,
    // but in a real-world app, you might want to.
  };

  return (
    <div className="w-full">
      {optimisticHabits && optimisticHabits.length > 0 ? (
        <ul className="space-y-3">
          {optimisticHabits.map((habit) => {
            const isCompleted = habit.status === 'terminado';
            return (
              <li
                key={habit.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:bg-slate-800/50 cursor-pointer"
                onClick={() => handleStatusChange(habit.id, habit.status)}
              >
                <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border-2 transition-colors ${isCompleted ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}>
                  {isCompleted && <CheckIcon className="h-3 w-3 text-slate-950" />}
                </div>
                <span className={`text-sm font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                  {habit.title}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-700/80">
          <p className="text-sm text-slate-500">No has definido hábitos. ¡Ve a la sección de hábitos para empezar!</p>
        </div>
      )}
    </div>
  );
}