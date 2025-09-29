'use client';

import React from 'react';

// Type for the daily statistics
export type DayStats = {
  date: string; // YYYY-MM-DD
  dayName: string; // e.g., 'Lunes', 'Martes'
  todoPercentage: number;
  habitPercentage: number;
  focusHours: number;
};

// Props for the component
type WeeklySummaryProps = {
  stats: DayStats[];
  loading: boolean;
};

const StatBar = ({ percentage, label }: { percentage: number; label: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <span className="text-xs font-bold text-cyan-400">{percentage.toFixed(0)}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-slate-700">
      <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

const DayCard = ({ stat }: { stat: DayStats }) => (
  <div className="rounded-lg bg-slate-900/70 p-4 flex flex-col gap-4 border border-cyan-500/10">
    <p className="text-center font-bold text-slate-300 text-sm">{stat.dayName}</p>
    <div className="space-y-4 flex-grow flex flex-col justify-center">
      <StatBar percentage={stat.todoPercentage} label="Pendientes" />
      <StatBar percentage={stat.habitPercentage} label="Hábitos" />
    </div>
    <div className="text-center pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">Enfoque</p>
        <p className="text-xl font-bold text-cyan-400">
            {stat.focusHours.toFixed(1)} <span className="text-base font-normal text-slate-500">hrs</span>
        </p>
    </div>
  </div>
);

export default function WeeklySummary({ stats, loading }: WeeklySummaryProps) {
  if (loading) {
    return (
      <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/10 bg-slate-900/50">
        <h2 className="mb-4 font-mono text-lg font-semibold text-cyan-400">Resumen Semanal</h2>
        <div className="text-center text-slate-400">Cargando estadísticas de la semana...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/10 bg-slate-900/50">
      <h2 className="mb-4 font-mono text-lg font-semibold text-cyan-400">Resumen Semanal</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {stats.map(stat => (
          <DayCard key={stat.date} stat={stat} />
        ))}
      </div>
    </div>
  );
}
