import { useEffect, useState, useCallback } from 'react';
import { useActiveWorkout } from '@/store/useActiveWorkout';

/**
 * useWorkoutTimer — Encapsula la lógica del contador de tiempo del workout
 *
 * Responsabilidades:
 * - Mantener un contador en tiempo real (actualiza cada segundo)
 * - Calcular duración desde startTime del store
 * - Formatear el tiempo para display (HH:MM:SS)
 * - Detener el contador cuando no hay workout activo
 */
export function useWorkoutTimer() {
  const startTime = useActiveWorkout(s => s.startTime);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  /**
   * Inicia el intervalo que actualiza el tiempo transcurrido cada segundo.
   */
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  /**
   * Formatea segundos al formato HH:MM:SS para display.
   * Evita crear nuevas strings innecesariamente con useCallback.
   */
  const formatTime = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // No mostrar horas si es 0, para URLs más cortas
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Obtiene el tiempo formateado actual.
   */
  const formattedTime = formatTime(elapsedSeconds);

  return {
    elapsedSeconds,
    formattedTime,
    formatTime,
  };
}
