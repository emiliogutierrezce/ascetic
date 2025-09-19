'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

// Recibimos el ID del usuario y el tiempo inicial de hoy desde el dashboard
export default function FocusTimer({
  userId,
  initialDuration,
}: {
  userId: string;
  initialDuration: number;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Estado para el tiempo total acumulado hoy (en segundos)
  const [totalSeconds, setTotalSeconds] = useState(initialDuration);
  // Estado para saber si el cronómetro está activo
  const [isActive, setIsActive] = useState(false);
  // Estado para guardar el ID del registro de hoy y no tener que buscarlo cada vez
  const [logId, setLogId] = useState<number | null>(null);

  // --- Efecto para manejar el contador ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && totalSeconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, totalSeconds]);

  // --- Función para guardar el progreso en Supabase ---
  // Usamos useCallback para que la función no se recree en cada render
  const saveData = useCallback(async () => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];

    // 'upsert' intenta actualizar una fila existente. Si no la encuentra, la crea.
    // Esto es perfecto para nuestro caso de uso.
    const { error } = await supabase.from('focus_logs').upsert({
      user_id: userId,
      log_date: today,
      duration_seconds: totalSeconds,
    }).select();

    if (error) {
      console.error('Error saving focus time:', error);
    }
    router.refresh(); // Actualiza los datos del servidor
  }, [totalSeconds, userId, supabase, router]);

  // --- Efecto para guardar datos cada 60 segundos ---
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isActive) {
        saveData();
      }
    }, 60000); // 60000 ms = 1 minuto

    return () => clearInterval(saveInterval);
  }, [isActive, saveData]);

  // --- Función para alternar el estado del cronómetro (play/pause) ---
  const toggleTimer = () => {
    setIsActive(!isActive);
    // Si estamos pausando, guardamos inmediatamente
    if (isActive) {
      saveData();
    }
  };

  // --- Funciones para formatear el tiempo a HH:MM:SS ---
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-5xl font-mono" suppressHydrationWarning>
        {formatTime(totalSeconds)}
      </p>
      <button
        onClick={toggleTimer}
        className={`px-6 py-2 rounded-md font-bold text-white transition-colors ${
          isActive
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isActive ? 'Pausar' : 'Iniciar'}
      </button>
    </div>
  );
}