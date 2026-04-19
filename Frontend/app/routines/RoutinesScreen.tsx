


import React, { useState, useEffect } from 'react';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';


const RoutinesScreen = () => {
  const [state, setState] = useState<'empty' | 'loading' | 'error' | 'success'>('loading');
  useEffect(() => {
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
    <Screen scroll safeAreaEdges={['top','bottom','left','right']}>
      <AppText variant="titleMd" marginBottom="$lg">Listado de rutinas</AppText>
      <AppText
        color="primary"
        marginTop="$2xl"
        onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: 'exerciseId' } })}
        textAlign="center"
        accessibilityRole="button"
      >
        Ir a detalle de ejercicio
      </AppText>
    </Screen>
  );
};

export default RoutinesScreen;
