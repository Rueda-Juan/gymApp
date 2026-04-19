


import React, { useState } from 'react';
import { YStack, useTheme } from 'tamagui';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';


const ExerciseDetailScreen = () => {
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  const theme = useTheme();
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
    <Screen scroll safeAreaEdges={['top','bottom','left','right']}>
      <YStack gap="$lg" padding="$lg">
        <AppText variant="titleMd">Detalle de ejercicio</AppText>
        <AppText
          color="primary"
          marginTop="$2xl"
          onPress={() => router.push(ROUTES.WORKOUT_SUMMARY)}
          textAlign="center"
          accessibilityRole="button"
        >
          Ir a resumen de sesión
        </AppText>
      </YStack>
    </Screen>
  );
};

export default ExerciseDetailScreen;
