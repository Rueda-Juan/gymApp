import { useRef } from 'react';

export function useDeletionTimeouts() {
  const deletionTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function setTimeoutFor(key: string, callback: () => void, delay: number) {
    clearTimeoutFor(key);
    deletionTimeouts.current[key] = setTimeout(() => {
      callback();
      delete deletionTimeouts.current[key];
    }, delay);
  }

  function clearTimeoutFor(key: string) {
    if (deletionTimeouts.current[key]) {
      clearTimeout(deletionTimeouts.current[key]);
      delete deletionTimeouts.current[key];
    }
  }

  function undoTimeoutFor(key: string, undoCallback: () => void) {
    clearTimeoutFor(key);
    undoCallback();
  }

  return { deletionTimeouts, setTimeoutFor, clearTimeoutFor, undoTimeoutFor };
}
