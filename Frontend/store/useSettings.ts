import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STANDARD_PLATES = [1.25, 2.5, 5, 10, 15, 20, 25];
export const BAR_WEIGHTS = [10, 15, 20];

export interface SettingsState {
  availablePlates: number[];
  defaultBarWeight: number;
  togglePlate: (weight: number) => void;
  setBarWeight: (weight: number) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      availablePlates: [1.25, 2.5, 5, 10, 15, 20, 25], // Default all on
      defaultBarWeight: 20,
      
      togglePlate: (weight) => 
        set((state) => ({
          availablePlates: state.availablePlates.includes(weight)
            ? state.availablePlates.filter((p) => p !== weight)
            : [...state.availablePlates, weight].sort((a, b) => b - a) // Keep sorted descending
        })),
        
      setBarWeight: (weight) => set({ defaultBarWeight: weight }),
    }),
    {
      name: 'gymapp-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
