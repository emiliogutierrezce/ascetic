'use client';

// Definimos un tipo para los datos de los pendientes
// Asegúrate de que coincida con las columnas de tu tabla 'todos'
type Todo = {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
};

export default function TodosTable({ todos }: { todos: Todo[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Límite</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {todos.map((todo) => (
            <tr key={todo.id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  todo.status === 'terminado'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {todo.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{todo.title}</div>
                {todo.description && <div className="text-sm text-gray-400">{todo.description}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {todo.due_date ? new Date(todo.due_date + 'T00:00:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin fecha'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {/* Próximamente: Botones de Editar y Eliminar */}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Editar</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {todos.length === 0 && (
        <p className="text-center py-8 text-gray-400">No se encontraron pendientes.</p>
      )}
    </div>
  );
}