import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { YStack, useTheme } from 'tamagui';
import { createContainer, AppContainer } from 'backend/shared/container';
import { getDatabase } from 'backend/infrastructure/database/connection';
import { runMigrations } from 'backend/infrastructure/database/migrations';

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
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error de inicialización</Text>
        <Text style={styles.errorDescription}>
          No pudimos cargar la base de datos local. Por favor, reiniciá la aplicación.
        </Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 12,
    color: '#ef4444',
  },
});