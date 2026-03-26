import { create } from 'zustand';

interface RestTimerStore {
  isActive: boolean;
  endTime: number | null;
  durationSeconds: number;
  
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  adjustTimer: (secondsToAdd: number) => void;
  getRemainingSeconds: () => number;
}

export const useRestTimer = create<RestTimerStore>((set, get) => ({
  isActive: false,
  endTime: null,
  durationSeconds: 0,

  startTimer: (seconds) => {
    set({
      isActive: true,
      durationSeconds: seconds,
      endTime: Date.now() + seconds * 1000,
    });
  },

  stopTimer: () => {
    set({
      isActive: false,
      endTime: null,
      durationSeconds: 0,
    });
  },

  adjustTimer: (secondsToAdd) => {
    const { endTime, isActive } = get();
    if (!isActive || !endTime) return;
    
    const newEndTime = endTime + (secondsToAdd * 1000);
    // Prevent going below current time (negative remaining)
    if (newEndTime <= Date.now()) {
      get().stopTimer();
      return;
    }
    
    set({ endTime: newEndTime });
  },

  getRemainingSeconds: () => {
    const { endTime, isActive } = get();
    if (!isActive || !endTime) return 0;
    
    const remainingMs = endTime - Date.now();
    if (remainingMs <= 0) {
      // Auto-stop if time passed
      setTimeout(() => get().stopTimer(), 0);
      return 0;
    }
    
    return Math.ceil(remainingMs / 1000);
  }
}));
