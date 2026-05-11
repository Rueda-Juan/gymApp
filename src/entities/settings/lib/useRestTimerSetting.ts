import React from 'react';
import { useSettings } from '../model/useSettings';

const MIN_REST_TIMER_SECONDS = 15;
const MAX_REST_TIMER_SECONDS = 600;

function clampRestTimerSeconds(seconds: number) {
  return Math.min(MAX_REST_TIMER_SECONDS, Math.max(MIN_REST_TIMER_SECONDS, seconds));
}

export function useRestTimerSetting() {
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);
  const setRestTimerSeconds = useSettings(s => s.setRestTimerSeconds);

  const restTimerDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [restTimerInput, setRestTimerInput] = React.useState(() => String(restTimerSeconds));

  React.useEffect(() => {
    setRestTimerInput(String(restTimerSeconds));
  }, [restTimerSeconds]);

  React.useEffect(() => {
    return () => {
      if (restTimerDebounceRef.current) {
        clearTimeout(restTimerDebounceRef.current);
      }
    };
  }, []);

  const applyRestTimerSeconds = React.useCallback((seconds: number) => {
    const clampedSeconds = clampRestTimerSeconds(seconds);
    setRestTimerSeconds(clampedSeconds);
    setRestTimerInput(String(clampedSeconds));
  }, [setRestTimerSeconds]);

  const handleRestTimerInputChange = React.useCallback((value: string) => {
    setRestTimerInput(value);

    if (restTimerDebounceRef.current) {
      clearTimeout(restTimerDebounceRef.current);
    }

    restTimerDebounceRef.current = setTimeout(() => {
      const nextSeconds = Number(value);
      if (!Number.isNaN(nextSeconds) && nextSeconds > 0) {
        const clampedSeconds = clampRestTimerSeconds(nextSeconds);
        setRestTimerSeconds(clampedSeconds);
        setRestTimerInput(String(clampedSeconds));
      }
    }, 600);
  }, [setRestTimerSeconds]);

  return {
    restTimerInput,
    setRestTimerInput,
    restTimerSeconds,
    applyRestTimerSeconds,
    handleRestTimerInputChange,
  } as const;
}

