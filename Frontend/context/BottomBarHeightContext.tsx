import React, { createContext, useContext, useState } from 'react';

type BottomBarContext = {
  bottomBarHeight: number;
  setBottomBarHeight: (h: number) => void;
  safeAreaBottom: number;
};

const BottomBarContext = createContext<BottomBarContext | null>(null);

export function BottomBarProvider({ children, initialSafeAreaBottom = 0 }: { children: React.ReactNode; initialSafeAreaBottom?: number }) {
  const [bottomBarHeight, setBottomBarHeight] = useState<number>(0);

  return (
    <BottomBarContext.Provider value={{ bottomBarHeight, setBottomBarHeight, safeAreaBottom: initialSafeAreaBottom }}>
      {children}
    </BottomBarContext.Provider>
  );
}

export function useBottomBarHeightContext() {
  const ctx = useContext(BottomBarContext);
  if (!ctx) {
    if (process.env.NODE_ENV === 'test') {
      return { bottomBarHeight: 0, setBottomBarHeight: () => {}, safeAreaBottom: 0 };
    }
    throw new Error('useBottomBarHeightContext must be used within BottomBarProvider');
  }
  return ctx;
}

export default BottomBarContext;
