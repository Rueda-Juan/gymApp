import React, { createContext, useContext, useMemo } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

export type MotionPreference = 'system' | 'full' | 'reduced';

interface MotionContextValue {
  isReduced: boolean;
}

const MotionContext = createContext<MotionContextValue>({ isReduced: false });

export function MotionProvider({ 
  preference, 
  children 
}: { 
  preference: MotionPreference; 
  children: React.ReactNode 
}) {
  const systemReducedMotion = useReducedMotion();

  const isReduced = useMemo(() => {
    return preference === 'reduced' || (preference === 'system' && systemReducedMotion);
  }, [preference, systemReducedMotion]);

  return (
    <MotionContext.Provider value={{ isReduced }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPreference() {
  return useContext(MotionContext);
}
