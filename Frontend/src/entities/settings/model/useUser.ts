import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other' | null;
  age: number | null;
  createdAt: number | null;
}

interface UserState {
  user: UserProfile;
  setUser: (partial: Partial<UserProfile>) => void;
  resetUser: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: { id: '', name: '', gender: null, age: null, createdAt: null },
      setUser: (partial) => set((s) => ({ user: { ...s.user, ...partial } })),
      resetUser: () => set({ user: { id: '', name: '', gender: null, age: null, createdAt: null } }),
    }),
    {
      name: 'gymapp-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
