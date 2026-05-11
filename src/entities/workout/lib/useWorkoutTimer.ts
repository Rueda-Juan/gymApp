import { useEffect, useState } from 'react';
import { useActiveWorkout } from '../model/useActiveWorkout';
import { formatElapsedTime } from '@/shared/lib/time';

export function useWorkoutTimer() {
  const startTime = useActiveWorkout(s => s.startTime);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return {
    elapsedSeconds,
    formattedTime: formatElapsedTime(elapsedSeconds),
    formatTime: formatElapsedTime,
  };
}

