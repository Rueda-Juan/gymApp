

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { ToggleChip } from '../../components/ui/ToggleChip';


const SettingsScreen = () => {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  React.useEffect(() => {
    setTimeout(() => {
      setState('success');
    }, 1000);
  }, []);

  const router = useRouter();

  if (state === 'loading') return null; // TODO: Unificar con LoadingSkeleton Tamagui
  if (state === 'error') return null; // TODO: Unificar con ErrorState Tamagui

  // success
  const { hapticsEnabled, setHapticsEnabled } = require('../../store/useSettings').useSettings();
  const { triggerLightHaptic } = require('../../utils/haptics');

  return (
    <Screen scroll safeAreaEdges={['top', 'bottom', 'left', 'right']}>
      <AppText variant="titleMd" marginBottom="$lg">Ajustes</AppText>
      <ToggleChip
        label={`Vibración/Haptics: ${hapticsEnabled ? 'Activado' : 'Desactivado'}`}
        isActive={hapticsEnabled}
        onPress={() => {
          setHapticsEnabled(!hapticsEnabled);
          if (!hapticsEnabled) triggerLightHaptic();
        }}
        accessibilityLabel="Alternar vibración/haptics"
      />
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

export default SettingsScreen;
