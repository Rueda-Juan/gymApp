import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { YStack, useTheme } from 'tamagui';
import { Database } from 'lucide-react-native';
import { createContainer, AppContainer } from 'backend/shared/container';
import { getDatabase } from 'backend/infrastructure/database/connection';
import { runMigrations } from 'backend/infrastructure/database/migrations';
import { EmptyState } from '@/components/ui/empty-state';
import { AppText } from '@/components/ui/AppText';

const DIContext = createContext<AppContainer | null>(null);

export const DIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [container, setContainer] = useState<AppContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;

    async function initDB() {
      try {
        const db = await getDatabase();
        await runMigrations(db);
        const appContainer = createContainer(db);

        if (isMounted) {
          setContainer(appContainer);
        }
      } catch (e) {
        console.error('Error inicializando la base de datos:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Error desconocido en la BD local'));
        }
      }
    }

    initDB();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <EmptyState
        icon={Database}
        title="Error de inicialización"
        description="No pudimos cargar la base de datos local. Por favor, reiniciá la aplicación."
        action={
          <AppText variant="bodySm" color="danger">
            {error.message}
          </AppText>
        }
      />
    );
  }

  if (!container) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </YStack>
    );
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
    throw new Error('useDI debe usarse dentro de un DIProvider');
  }
  return context;
};