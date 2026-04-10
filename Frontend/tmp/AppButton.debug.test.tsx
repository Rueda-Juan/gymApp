import React from 'react';
import { render } from '@testing-library/react-native';
import { AppButton } from '../components/ui/AppButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';

test('debug AppButton tree', () => {
  const { debug } = render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <TamaguiProvider config={config} defaultTheme="light">
        <AppButton label="Test Button" />
      </TamaguiProvider>
    </SafeAreaProvider>
  );
  debug();
});
