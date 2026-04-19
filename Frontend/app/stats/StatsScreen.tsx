

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';


const StatsScreen = () => {
  const [state, setState] = useState<'empty' | 'loading' | 'error' | 'success'>('loading');
  React.useEffect(() => {
    setTimeout(() => {
      setState('success');
    }, 1000);
  }, []);

  const router = useRouter();

  if (state === 'loading') return null; // TODO: Unificar con LoadingSkeleton Tamagui
  if (state === 'error') return null; // TODO: Unificar con ErrorState Tamagui
  if (state === 'empty') return null; // TODO: Unificar con EmptyState Tamagui

  // success
  return (
    <Screen scroll safeAreaEdges={['top', 'bottom', 'left', 'right']}>
      <AppText variant="titleMd" marginBottom="$lg">Estadísticas</AppText>
      <AppText
        color="primary"
        marginTop="$2xl"
        onPress={() => router.push(ROUTES.TABS)}
        textAlign="center"
        accessibilityRole="button"
      >
        Volver al dashboard
      </AppText>
    </Screen>
  );
};

export default StatsScreen;
