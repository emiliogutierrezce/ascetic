'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FocusLog = {
  id: number;
  log_date: string;
  duration_seconds: number;
};

// Helper para formatear segundos a HH:MM:SS
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function FocusHistory({ logs }: { logs: FocusLog[] }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  // Estados para cada unidad de tiempo para facilitar la edición
  const [editHours, setEditHours] = useState('00');
  const [editMinutes, setEditMinutes] = useState('00');
  const [editSeconds, setEditSeconds] = useState('00');

  // Obtenemos las fechas de hoy y ayer para saber qué filas son editables
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const handleEdit = (log: FocusLog) => {
    setEditingId(log.id);
    const hours = Math.floor(log.duration_seconds / 3600);
    const minutes = Math.floor((log.duration_seconds % 3600) / 60);
    const seconds = log.duration_seconds % 60;
    setEditHours(String(hours).padStart(2, '0'));
    setEditMinutes(String(minutes).padStart(2, '0'));
    setEditSeconds(String(seconds).padStart(2, '0'));
  };

  const handleUpdate = async (id: number) => {
    const totalSeconds = parseInt(editHours) * 3600 + parseInt(editMinutes) * 60 + parseInt(editSeconds);
    await supabase.from('focus_logs').update({ duration_seconds: totalSeconds }).eq('id', id);
    setEditingId(null);
    router.refresh();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <ul className="divide-y divide-gray-700">
        {logs.map((log) => (
          <li key={log.id} className="py-4 flex justify-between items-center">
            {editingId === log.id ? (
              // --- MODO EDICIÓN ---
              <div className="flex-grow flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <input type="number" value={editHours} onChange={e => setEditHours(e.target.value)} className="w-16 p-2 rounded bg-gray-700 text-white text-center"/>:
                  <input type="number" value={editMinutes} onChange={e => setEditMinutes(e.target.value)} className="w-16 p-2 rounded bg-gray-700 text-white text-center"/>:
                  <input type="number" value={editSeconds} onChange={e => setEditSeconds(e.target.value)} className="w-16 p-2 rounded bg-gray-700 text-white text-center"/>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleUpdate(log.id)} className="text-green-400 hover:text-green-300">Guardar</button>
                   <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">Cancelar</button>
                </div>
              </div>
            ) : (
              // --- MODO VISTA ---
              <>
                <div>
                  <p className="text-lg font-medium text-white">
                    {new Date(log.log_date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-400">Tiempo de enfoque: {formatTime(log.duration_seconds)}</p>
                </div>
                {(log.log_date === today || log.log_date === yesterday) && (
                  <button onClick={() => handleEdit(log)} className="text-indigo-400 hover:text-indigo-300">
                    Editar
                  </button>
                )}
              </>
            )}
          </li>
        ))}
        {logs.length === 0 && (
            <p className="text-center py-8 text-gray-400">No hay registros de enfoque.</p>
        )}
      </ul>
    </div>
  );
}