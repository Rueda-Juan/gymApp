

import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';

const ExerciseDetailScreen = () => {
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  React.useEffect(() => {
    setTimeout(() => {
      setState('success');
    }, 1000);
  }, []);

  const router = useRouter();

  if (state === 'loading') return <LoadingSkeleton />;
  if (state === 'error') return <ErrorState message="Error al cargar ejercicio" />;
  if (state === 'empty') return <EmptyState message="Ejercicio no encontrado" />;

  // success
  return (
    <ScrollView>
      <Text>Detalle de ejercicio</Text>
      {/* Ejemplo de navegación a SummaryScreen */}
      <Text style={{ color: 'blue' }} onPress={() => router.push(ROUTES.WORKOUT_SUMMARY)}>
        Ir a resumen de sesión
      </Text>
    </ScrollView>
  );
};

export default ExerciseDetailScreen;
