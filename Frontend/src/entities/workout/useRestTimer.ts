import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RestTimerStore {
  isActive: boolean;
  endTime: number | null;
  durationSeconds: number;
  
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  adjustTimer: (secondsToAdd: number) => void;
  getRemainingSeconds: () => number;
}

export const useRestTimer = create<RestTimerStore>()(
  persist(
    (set, get) => ({
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
        const { endTime, isActive, durationSeconds } = get();
        if (!isActive || !endTime) return;
        
        const newEndTime = endTime + (secondsToAdd * 1000);
        if (newEndTime <= Date.now()) {
          get().stopTimer();
          return;
        }
        
        set({ endTime: newEndTime, durationSeconds: durationSeconds + secondsToAdd });
      },

      getRemainingSeconds: () => {
        const { endTime, isActive } = get();
        if (!isActive || !endTime) return 0;
        
        const remainingMs = endTime - Date.now();
        if (remainingMs <= 0) return 0;
        
        return Math.ceil(remainingMs / 1000);
      }
    }), {
      name: 'rest-timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the timer data; skip derived/computed values
      partialize: (state) => ({
        isActive: state.isActive,
        endTime: state.endTime,
        durationSeconds: state.durationSeconds,
      }),
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RestTimerStore {
  isActive: boolean;
  endTime: number | null;
  durationSeconds: number;
  
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  adjustTimer: (secondsToAdd: number) => void;
  getRemainingSeconds: () => number;
}

export const useRestTimer = create<RestTimerStore>()(
  persist(
    (set, get) => ({
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
    const { endTime, isActive, durationSeconds } = get();
    if (!isActive || !endTime) return;
    
    const newEndTime = endTime + (secondsToAdd * 1000);
    if (newEndTime <= Date.now()) {
      get().stopTimer();
      return;
    }
    
    set({ endTime: newEndTime, durationSeconds: durationSeconds + secondsToAdd });
  },

  getRemainingSeconds: () => {
    const { endTime, isActive } = get();
    if (!isActive || !endTime) return 0;
    
    const remainingMs = endTime - Date.now();
    if (remainingMs <= 0) return 0;
    
    return Math.ceil(remainingMs / 1000);
  }
}), {
  name: 'rest-timer-storage',
  storage: createJSONStorage(() => AsyncStorage),
  // Only persist the timer data; skip derived/computed values
  partialize: (state) => ({
    isActive: state.isActive,
    endTime: state.endTime,
    durationSeconds: state.durationSeconds,
  }),
}));
