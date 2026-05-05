import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STANDARD_PLATES = [1.25, 2.5, 5, 10, 15, 20, 25];
export const BAR_WEIGHTS = [10, 15, 20];

export type ThemeMode = 'system' | 'light' | 'dark';
export type MotionPreference = 'system' | 'full' | 'reduced';

export interface SettingsState {
  availablePlates: number[];
  defaultBarWeight: number;
  restTimerSeconds: number;
  themeMode: ThemeMode;
  motionPreference: MotionPreference;
  hapticsEnabled: boolean;
  togglePlate: (weight: number) => void;
  setBarWeight: (weight: number) => void;
  setRestTimerSeconds: (seconds: number) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setMotionPreference: (preference: MotionPreference) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      availablePlates: [...STANDARD_PLATES],
      defaultBarWeight: 20,
      restTimerSeconds: 60,
      themeMode: 'system',
      motionPreference: 'system',
      hapticsEnabled: true,
      
      togglePlate: (weight) => 
        set((state) => ({
          availablePlates: state.availablePlates.includes(weight)
            ? state.availablePlates.filter((p) => p !== weight)
            : [...state.availablePlates, weight].sort((a, b) => b - a) // Keep sorted descending
        })),
        
      setBarWeight: (weight) => set({ defaultBarWeight: weight }),
      setRestTimerSeconds: (seconds) => set({ restTimerSeconds: seconds }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setMotionPreference: (preference) => set({ motionPreference: preference }),
      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
    }),
    {
      name: 'gymapp-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

