'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getTodayInMexicoCity } from '../../../lib/date';

// --- Icons ---
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const STORAGE_KEY = 'focusTimerState';

// Type for the state saved in localStorage
type StoredTimerState = {
  savedElapsedTime: number;
  runStartTime: number | null;
  logDate: string;
};

export default function FocusTimer({ userId }: { userId: string; initialDuration: number; }) {
  const TEN_HOURS_IN_SECONDS = 10 * 60 * 60;
  const supabase = createClientComponentClient();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveDataToSupabase = useCallback(async (secondsToSave: number) => {
    if (!userId) return;
    const today = getTodayInMexicoCity();
    await supabase.from('focus_logs').upsert({
      user_id: userId,
      log_date: today,
      duration_seconds: Math.floor(secondsToSave),
    }, { onConflict: 'user_id,log_date' });
  }, [userId, supabase]);

  // Load state from localStorage on initial mount
  useEffect(() => {
    const loadAndRestoreState = async () => {
      try {
        const storedStateJSON = localStorage.getItem(STORAGE_KEY);
        const today = getTodayInMexicoCity();

        if (storedStateJSON) {
          const storedState: StoredTimerState = JSON.parse(storedStateJSON);

          // Reset if the stored date is not today
          if (storedState.logDate !== today) {
            localStorage.removeItem(STORAGE_KEY);
            setElapsedSeconds(0);
            setIsActive(false);
            return;
          }

          let totalElapsed = storedState.savedElapsedTime;
          let currentlyActive = false;

          // If it was running when the page was closed, calculate offline progress
          if (storedState.runStartTime) {
            const offlineProgress = (Date.now() - storedState.runStartTime) / 1000;
            totalElapsed += offlineProgress;
            currentlyActive = true;
          }

          setElapsedSeconds(totalElapsed);
          setIsActive(currentlyActive);

          // Immediately save the consolidated state back to DB and localStorage
          if (currentlyActive) {
              const newState: StoredTimerState = { savedElapsedTime: totalElapsed, runStartTime: Date.now(), logDate: today };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
              saveDataToSupabase(totalElapsed);
          }

        } else {
          // If no stored state, use the initial duration from the server (if any)
          // This handles the very first load of the day
          const { data } = await supabase.from('focus_logs').select('duration_seconds').eq('user_id', userId).eq('log_date', today).single();
          const initialSeconds = data?.duration_seconds || 0;
          setElapsedSeconds(initialSeconds);
          const newState: StoredTimerState = { savedElapsedTime: initialSeconds, runStartTime: null, logDate: today };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        }
      } catch (error) {
        console.error("Failed to load or process timer state:", error);
        // Handle potential JSON parsing errors or other issues
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadAndRestoreState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs only once on mount

  // Timer interval logic
  useEffect(() => {
    if (isActive) {
      const storedStateJSON = localStorage.getItem(STORAGE_KEY);
      const storedState: StoredTimerState = storedStateJSON ? JSON.parse(storedStateJSON) : { savedElapsedTime: 0, runStartTime: Date.now(), logDate: getTodayInMexicoCity() };

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - (storedState.runStartTime || Date.now())) / 1000;
        setElapsedSeconds(storedState.savedElapsedTime + elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const toggleTimer = () => {
    const today = getTodayInMexicoCity();
    const storedStateJSON = localStorage.getItem(STORAGE_KEY);
    const currentState: StoredTimerState = storedStateJSON ? JSON.parse(storedStateJSON) : { savedElapsedTime: 0, runStartTime: null, logDate: today };

    const newState: StoredTimerState = {
        logDate: today,
        savedElapsedTime: elapsedSeconds,
        runStartTime: !isActive ? Date.now() : null
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setIsActive(!isActive);

    // Save to DB only when pausing
    if (isActive) {
      saveDataToSupabase(elapsedSeconds);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsedSeconds / TEN_HOURS_IN_SECONDS, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <div className="relative h-52 w-52">
        <svg className="absolute top-0 left-0 h-full w-full" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} strokeWidth="8" className="stroke-slate-800" fill="none" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="8"
            className="stroke-cyan-400 transition-all duration-1000 ease-linear"
            fill="none"
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            suppressHydrationWarning
          />
        </svg>
        <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center">
          <p className="font-mono text-4xl font-bold tracking-tighter text-slate-200" suppressHydrationWarning>
            {formatTime(elapsedSeconds)}
          </p>
          <p className="text-sm text-slate-500">Tiempo de Enfoque</p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full gap-4">
        <button 
          onClick={toggleTimer} 
          className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105 disabled:bg-slate-700 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed">
          {isActive ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
        </button>
      </div>
    </div>
  );
}
