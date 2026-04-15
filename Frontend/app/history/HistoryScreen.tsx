
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';

import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';

const HistoryScreen = () => {
  const [state, setState] = useState<'empty' | 'loading' | 'error' | 'success'>('loading');
  // Simulación de lógica de estado (reemplazar por lógica real)
  React.useEffect(() => {
    setTimeout(() => {
      setState('success');
    }, 1000);
  }, []);

  const router = useRouter();

  if (state === 'loading') return <LoadingSkeleton />;
  if (state === 'error') return <ErrorState message="Error al cargar historial" />;
  if (state === 'empty') return <EmptyState message="Sin entrenamientos registrados" />;

  // success
  return (
    <ScrollView>
      <Text>Historial agrupado por semana</Text>
      <Text style={{ color: 'blue' }} onPress={() => router.push(ROUTES.WORKOUT_SUMMARY)}>
        Ir a resumen de sesión
      </Text>
    </ScrollView>
  );
};

export default HistoryScreen;
