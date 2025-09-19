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
    <div className="bg-gray-700 p-4 rounded-lg text-center">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-white">{value} <span className="text-lg text-gray-400">/ {total}</span></p>
      <p className="text-sm font-semibold text-indigo-400">{percentage}% completado</p>
    </div>
  );
};

export default function WeeklySummary({ completedTodos, totalTodos, completedHabits, totalHabits }: SummaryProps) {
  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Resumen Semanal (Últimos 7 días)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Pendientes Completados" value={completedTodos} total={totalTodos} />
        <StatCard title="Hábitos Logrados" value={completedHabits} total={totalHabits} />
      </div>
    </div>
  );
}