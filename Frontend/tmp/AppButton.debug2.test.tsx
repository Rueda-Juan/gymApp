import React from 'react';
import { render } from '@testing-library/react-native';
import { AppButton } from '../components/ui/AppButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';

test('debug AppButton flex', () => {
  const Providers = ({ children }: { children: React.ReactNode }) => (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        {children}
      </TamaguiProvider>
    </SafeAreaProvider>
  );

  const { debug, rerender, getByTestId } = render(
    <AppButton label="FullWidth" fullWidth />, { wrapper: Providers }
  );
  console.log('--- initial ---');
  debug();
  rerender(<AppButton label="Flex" flex={1} fullWidth={false} />);
  console.log('--- after rerender ---');
  debug();
  const btn = getByTestId('AppButton');
  console.log('props:', btn.props);
});
