'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';

import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import HabitList from '../components/HabitList';
import FocusTimer from '../components/FocusTimer';
import DailySummary from '../components/DailySummary';
import WeeklySummary, { DayStats } from '../components/WeeklySummary';
import NotesList from '../components/NotesList'; // <-- Import NotesList

import { getTodayInMexicoCity, getWeekDateRange } from '../../../lib/date';

// Define types for our state
type Todo = { id: number; title: string; description: string | null; status: string; due_date: string; };
type ClientHabit = { id: number; title: string; user_id: string; status: string; };
type Note = { id: number; title: string; description: string | null; }; // <-- Define Note type
type FocusLog = { duration_seconds: number } | null;

// Type for raw DB data
type HabitCompletion = { habit_id: number; status: string; completion_date: string };
type RawFocusLog = { duration_seconds: number; log_date: string };

export default function DashboardClient() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Data State
  const [todosToday, setTodosToday] = useState<Todo[]>([]);
  const [habitsToday, setHabitsToday] = useState<ClientHabit[]>([]);
  const [notes, setNotes] = useState<Note[]>([]); // <-- Add notes state
  const [focusLogToday, setFocusLogToday] = useState<FocusLog>(null);
  const [weeklyStats, setWeeklyStats] = useState<DayStats[]>([]);

  // Daily Summary State
  const [completedTodosToday, setCompletedTodosToday] = useState(0);
  const [totalTodosToday, setTotalTodosToday] = useState(0);
  const [completedHabitsToday, setCompletedHabitsToday] = useState(0);
  const [totalHabitsToday, setTotalHabitsToday] = useState(0);


  const fetchDashboardData = useCallback(async (currentUser: User) => {
    setLoading(true);
    const todayStr = getTodayInMexicoCity();
    const { startOfWeek, endOfWeek } = getWeekDateRange();

    try {
      // --- Fetch all data ---
      const {
        data: weeklyTodos,
        error: todosError
      } = await supabase.from('todos').select('id, title, description, status, due_date').eq('user_id', currentUser.id).gte('due_date', startOfWeek).lte('due_date', endOfWeek);
      if (todosError) throw todosError;

      const { data: allHabits, error: habitsError } = await supabase.from('habits').select(`id, title, user_id`).eq('user_id', currentUser.id);
      if (habitsError) throw habitsError;

      const { data: weeklyCompletions, error: completionsError } = await supabase.from('habit_completions').select('habit_id, status, completion_date').eq('user_id', currentUser.id).gte('completion_date', startOfWeek).lte('completion_date', endOfWeek);
      if (completionsError) throw completionsError;

      const { data: weeklyFocusLogs, error: focusError } = await supabase.from('focus_logs').select('duration_seconds, log_date').eq('user_id', currentUser.id).gte('log_date', startOfWeek).lte('log_date', endOfWeek);
      if (focusError) throw focusError;

      const { data: notesData, error: notesError } = await supabase.from('notes').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
      if (notesError) throw notesError;
      setNotes(notesData || []);

      // --- Process data for TODAY ---
      const todaysTodos = weeklyTodos?.filter(t => t.due_date === todayStr) || [];
      setTodosToday(todaysTodos);
      setTotalTodosToday(todaysTodos.length);
      setCompletedTodosToday(todaysTodos.filter(t => t.status === 'terminado').length);

      const todaysCompletions = weeklyCompletions?.filter(c => c.completion_date === todayStr) || [];
      const completedHabitIdsToday = new Set(todaysCompletions.filter(c => c.status === 'terminado').map(c => c.habit_id));
      const clientHabitsToday: ClientHabit[] = (allHabits || []).map(habit => ({
        id: habit.id,
        title: habit.title,
        user_id: habit.user_id,
        status: completedHabitIdsToday.has(habit.id) ? 'terminado' : 'pendiente'
      }));
      setHabitsToday(clientHabitsToday);
      setTotalHabitsToday(allHabits?.length || 0);
      setCompletedHabitsToday(completedHabitIdsToday.size);

      const focusLogForToday = weeklyFocusLogs?.find(f => f.log_date === todayStr) || null;
      setFocusLogToday(focusLogForToday);

      // --- Process data for the WEEK ---
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const weekStats: DayStats[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        const dayStr = day.toISOString().split('T')[0];

        const todosForDay = weeklyTodos?.filter(t => t.due_date === dayStr) || [];
        const completionsForDay = weeklyCompletions?.filter(c => c.completion_date === dayStr) || [];
        const focusForDay = weeklyFocusLogs?.find(f => f.log_date === dayStr);

        const totalHabits = allHabits?.length || 0;
        const completedHabits = completionsForDay.filter(c => c.status === 'terminado').length;

        weekStats.push({
          date: dayStr,
          dayName: dayNames[i],
          todoPercentage: todosForDay.length > 0 ? (todosForDay.filter(t => t.status === 'terminado').length / todosForDay.length) * 100 : 0,
          habitPercentage: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
          focusHours: (focusForDay?.duration_seconds || 0) / 3600,
        });
      }
      setWeeklyStats(weekStats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchDashboardData(user);
      } else {
        setLoading(false);
      }
    };
    getUserAndData();
  }, [supabase, fetchDashboardData]);

  const handleTodoUpdate = (newStatus: string) => {
    if (newStatus === 'terminado') {
      setCompletedTodosToday(prev => prev + 1);
    } else {
      setCompletedTodosToday(prev => prev - 1);
    }
  };

  const handleHabitUpdate = (newStatus: string) => {
    if (newStatus === 'terminado') {
      setCompletedHabitsToday(prev => prev + 1);
    } else {
      setCompletedHabitsToday(prev => prev - 1);
    }
  };

  // NotesList uses router.refresh(), so we need a way to trigger a refetch.
  const handleNoteUpdate = () => {
    if (user) fetchDashboardData(user);
  }

  if (loading && !weeklyStats.length) { // Show initial loading state
    return <div className="text-center">Cargando...</div>;
  }
  
  if (!user) {
     return <div className="text-center">No se pudo cargar el usuario. Por favor, intente iniciar sesión de nuevo.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-200">
          Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
        </h1>
        <p className="text-slate-400">Resumen de tu actividad y tareas para hoy.</p>
      </div>

      <DailySummary
        completedTodos={completedTodosToday}
        totalTodos={totalTodosToday}
        completedHabits={completedHabitsToday}
        totalHabits={totalHabitsToday}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-cyan-500/10 bg-slate-900/50 p-4 sm:p-6 shadow-[0_0_15px_rgba(74,222,128,0.03)]">
            <h2 className="mb-4 font-mono text-lg font-semibold text-cyan-400">Pendientes del Día</h2>
            <AddTodoForm userId={user.id} />
            <TodoList todos={todosToday} onTodoUpdate={handleTodoUpdate} />
          </div>
          <div className="rounded-xl border border-cyan-500/10 bg-slate-900/50 p-4 sm:p-6 shadow-[0_0_15px_rgba(74,222,128,0.03)]">
            <h2 className="mb-4 font-mono text-lg font-semibold text-cyan-400">Hábitos del Día</h2>
            <HabitList habits={habitsToday} userId={user.id} onHabitUpdate={handleHabitUpdate} />
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/10 bg-slate-900/50 p-4 sm:p-6 shadow-[0_0_15px_rgba(74,222,128,0.03)] flex flex-col">
          <h2 className="mb-4 font-mono text-lg font-semibold text-cyan-400">Tiempo de Enfoque</h2>
          <div className="flex-grow flex items-center justify-center">
            <FocusTimer userId={user.id} initialDuration={focusLogToday?.duration_seconds ?? 36000} />
          </div>
        </div>
      </div>

      <NotesList notes={notes} userId={user.id} />

      <WeeklySummary stats={weeklyStats} loading={loading} />
    </div>
  );
}