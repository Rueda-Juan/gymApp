import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { YStack, useTheme } from 'tamagui';
import { createContainer, AppContainer } from 'backend/shared/container';
import { getDatabase } from 'backend/infrastructure/database/connection';
import { runMigrations } from 'backend/infrastructure/database/migrations';

const DIContext = createContext<AppContainer | null>(null);

// Error screen renders before the theme provider is available (DB init failure
// happens before any React tree is mounted), so raw hex fallbacks are
// intentional here — do NOT replace with Tamagui tokens.
const ERROR_FALLBACK_COLORS = {
  background:  '#000',
  title:       '#fff',
  description: '#999',
  errorText:   '#ef4444',
} as const;

interface DIProviderProps {
  children: React.ReactNode;
}

export function DIProvider({ children }: DIProviderProps) {
  const [container, setContainer] = useState<AppContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const controller = new AbortController();

    async function initDB() {
      try {
        const db = await getDatabase();
        await runMigrations(db);
        const appContainer = createContainer(db);

        if (!controller.signal.aborted) {
          setContainer(appContainer);
        }
      } catch (e) {
        const wrappedError = e instanceof Error ? e : new Error('Error desconocido en la BD local');
        // Log regardless of mount state — this failure warrants a crash report
        console.error('Error inicializando la base de datos:', wrappedError);
        if (!controller.signal.aborted) {
          setError(wrappedError);
        }
      }
    }

    initDB();
    return () => controller.abort();
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
}

export function useDI() {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDI debe usarse dentro de un DIProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: ERROR_FALLBACK_COLORS.background,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ERROR_FALLBACK_COLORS.title,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: ERROR_FALLBACK_COLORS.description,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 12,
    color: ERROR_FALLBACK_COLORS.errorText,
  },
});