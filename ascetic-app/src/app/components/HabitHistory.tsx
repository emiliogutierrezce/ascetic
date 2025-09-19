'use client';

// Definimos los tipos de datos que el componente recibirá
type HabitWithHistory = {
  id: number;
  title: string;
  completionsByDate: { [date: string]: boolean };
};

type Props = {
  habits: HabitWithHistory[];
  dateRange: string[];
};

export default function HabitHistory({ habits, dateRange }: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Historial de Cumplimiento (Últimos 30 días)</h2>
      {habits.length > 0 ? (
        <div className="overflow-x-auto bg-gray-800 rounded-lg p-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left text-sm font-semibold text-gray-300">Hábito</th>
                {dateRange.map(date => (
                  <th key={date} className="py-2 px-3 text-center text-sm font-semibold text-gray-400">
                    {new Date(date + 'T00:00:00').getDate()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {habits.map(habit => (
                <tr key={habit.id}>
                  <td className="py-3 px-3 text-white font-medium">{habit.title}</td>
                  {dateRange.map(date => (
                    <td key={date} className="py-3 px-3 text-center">
                      <span className={`inline-block w-4 h-4 rounded-full ${habit.completionsByDate[date] ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <p className="text-center py-8 text-gray-400">Aún no hay historial de hábitos para mostrar.</p>
      )}
    </div>
  );
}