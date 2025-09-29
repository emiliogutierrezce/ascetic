'use client';

type SummaryProps = {
  completedTodos: number;
  totalTodos: number;
  completedHabits: number;
  totalHabits: number;
};

const StatCard = ({ title, value, total }: { title: string; value: number; total: number }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-slate-900/50 p-4">
      <h3 className="font-mono text-sm text-slate-400">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-4xl font-bold text-cyan-400">{value}</p>
        <span className="text-lg text-slate-500">/ {total}</span>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-right font-mono text-xs text-cyan-400">{percentage}%</p>
    </div>
  );
};

export default function DailySummary({ completedTodos, totalTodos, completedHabits, totalHabits }: SummaryProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-300">Resumen del Día</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard title="Pendientes Completados" value={completedTodos} total={totalTodos} />
        <StatCard title="Hábitos Logrados" value={completedHabits} total={totalHabits} />
      </div>
    </div>
  );
}