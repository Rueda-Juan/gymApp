import React from 'react';
import { Text, View } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from './connection';
import migrations from './drizzle/migrations';
import { LoadingSkeleton } from '@/shared/ui';

export function DbProvider({ children }: { children: React.ReactNode }) {
  // Al importar 'db' de forma síncrona, useMigrations tiene la instancia desde el primer milisegundo.
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.error('Migration error:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', color: 'red' }}>
          Error crítico al inicializar la base de datos. Por favor, reinicia la aplicación.
        </Text>
      </View>
    );
  }

  if (!success) {
    return <LoadingSkeleton />;
  }

  return <>{children}</>;
}