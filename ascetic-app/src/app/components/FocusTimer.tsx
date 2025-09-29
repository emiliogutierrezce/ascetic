'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useCallback } from 'react';
import { getTodayInMexicoCity } from '../../../lib/date';

// --- Icons ---
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;

export default function FocusTimer({ userId, initialDuration }: { userId: string; initialDuration: number; }) {
  const TEN_HOURS_IN_SECONDS = 10 * 60 * 60;
  const supabase = createClientComponentClient();

  const [remainingSeconds, setRemainingSeconds] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);

  const saveData = useCallback(async (secondsToSave: number) => {
    if (!userId) return;
    const today = getTodayInMexicoCity();
    await supabase.from('focus_logs').upsert({
      user_id: userId,
      log_date: today,
      duration_seconds: secondsToSave,
    });
    // No need to call router.refresh() here as it won't re-trigger client component effects
  }, [userId, supabase]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(sec => {
          if (sec > 1) return sec - 1;
          // When it hits 1, it will become 0 and we stop.
          setIsActive(false);
          return 0;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, remainingSeconds]);

  const toggleTimer = () => {
    if (isActive) saveData(remainingSeconds);
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = remainingSeconds / TEN_HOURS_IN_SECONDS;
  const offset = circumference * progress;

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      <div className="relative h-52 w-52">
        <svg className="absolute top-0 left-0 h-full w-full" viewBox="0 0 200 200">
          {/* Background track */}
          <circle cx="100" cy="100" r={radius} strokeWidth="8" className="stroke-slate-800" fill="none" />
          {/* Progress ring */}
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
            {formatTime(remainingSeconds)}
          </p>
          <p className="text-sm text-slate-500">Tiempo Restante</p>
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <button 
          onClick={toggleTimer} 
          disabled={remainingSeconds === 0}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105 disabled:bg-slate-700 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed">
          {isActive ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
        </button>
      </div>
    </div>
  );
}