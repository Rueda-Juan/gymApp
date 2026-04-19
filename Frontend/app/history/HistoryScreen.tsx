

import React, { useState } from 'react';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';


const HistoryScreen = () => {
  const [state, setState] = useState<'empty' | 'loading' | 'error' | 'success'>('loading');
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
    <Screen scroll safeAreaEdges={['top','bottom','left','right']}>
      <AppText variant="titleMd" marginBottom="$lg">Historial agrupado por semana</AppText>
      <AppText
        color="primary"
        marginTop="$2xl"
        onPress={() => router.push(ROUTES.WORKOUT_SUMMARY)}
        textAlign="center"
        accessibilityRole="button"
      >
        Ir a resumen de sesión
      </AppText>
    </Screen>
  );
};

export default HistoryScreen;
