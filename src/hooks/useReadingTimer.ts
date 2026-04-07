import { useState, useEffect, useRef } from 'react';

interface UseReadingTimerReturn {
  seconds: number;
  formattedTime: string;
  isRunning: boolean;
  stop: () => number; // retorna los segundos totales al parar
}

export function useReadingTimer(): UseReadingTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick cada segundo cuando está corriendo
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Pausar/reanudar automáticamente al cambiar de pestaña
  useEffect(() => {
    const handleVisibility = () => {
      setIsRunning(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stop = (): number => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    return seconds;
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return { seconds, formattedTime, isRunning, stop };
}

/**
 * Genera el mensaje de la notificación final según el tiempo leído.
 */
export function getFinishMessage(seconds: number, segmentsRead: number): string {
  const mins = Math.floor(seconds / 60);

  if (mins < 2) {
    return `Sesión relámpago: ${seconds}s — ${segmentsRead} sección${segmentsRead !== 1 ? 'es' : ''} leída${segmentsRead !== 1 ? 's' : ''}. ¡Cada página cuenta! 📖`;
  }
  if (mins < 10) {
    return `¡${mins} minutos de lectura! — ${segmentsRead} sección${segmentsRead !== 1 ? 'es' : ''} completada${segmentsRead !== 1 ? 's' : ''}. Buen arranque 🚀`;
  }
  if (mins < 20) {
    return `¡Gran avance! ${mins} minutos bien aprovechados — ${segmentsRead} secciones leídas 🎯`;
  }
  if (mins < 40) {
    return `¡Impresionante! ${mins} minutos de concentración profunda — ${segmentsRead} secciones completadas 🔥`;
  }
  return `¡Sesión épica! ${mins} minutos leyendo — ${segmentsRead} secciones. ¡Eres un lector de élite! 🏆`;
}
