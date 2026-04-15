

import React, { useState, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';

const RoutinesScreen = () => {
  const [state, setState] = useState<'empty' | 'loading' | 'error' | 'success'>('loading');
  React.useEffect(() => {
    setTimeout(() => {
      setState('success');
    }, 1000);
  }, []);

  const router = useRouter();

  if (state === 'loading') return <LoadingSkeleton />;
  if (state === 'error') return <ErrorState message="Error al cargar rutinas" />;
  if (state === 'empty') return <EmptyState message="No tienes rutinas" />;

  // success
  return (
    <ScrollView>
      <Text>Listado de rutinas</Text>
      {/* Ejemplo de navegación a ExerciseDetailScreen */}
      <Text style={{ color: 'blue' }} onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: 'exerciseId' } })}>
        Ir a detalle de ejercicio
      </Text>
    </ScrollView>
  );
};

export default RoutinesScreen;
