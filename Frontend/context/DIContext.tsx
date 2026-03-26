import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { createContainer, AppContainer } from 'backend/shared/container';
import { getDatabase } from 'backend/infrastructure/database/connection';
import { runMigrations } from 'backend/infrastructure/database/migrations';

const DIContext = createContext<AppContainer | null>(null);

export const DIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [container, setContainer] = useState<AppContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initDB() {
      try {
        const db = await getDatabase();
        await runMigrations(db as any);
        const appContainer = createContainer(db as any);
        setContainer(appContainer);
      } catch (e) {
        console.error('Failed to initialize database:', e);
        setError(e as Error);
      }
    }

    initDB();
  }, []);

  if (error) {
    // Basic error UI for DB failure
    return null; 
  }

  if (!container) {
    // Loading state for DB initialization
    return null;
  }

  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

export const useDI = () => {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDI must be used within a DIProvider');
  }
  return context;
};
