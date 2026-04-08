import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../AppButton';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        {children}
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}

describe('AppButton', () => {
  it('renders label and handles press', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AppButton label="Test Button" onPress={onPress} />, { wrapper: Providers }
    );
    const button = getByTestId('AppButton');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalled();
    // Label visible
    const label = getByTestId('AppButtonLabel');
    expect(label.props.children).toBe('Test Button');
  });

  it('disables when loading', () => {
    const { getByTestId } = render(
      <AppButton label="Loading" loading />, { wrapper: Providers }
    );
    const button = getByTestId('AppButton');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('truncates long label', () => {
    const longLabel = 'A'.repeat(100);
    const { getByTestId } = render(
      <AppButton label={longLabel} />, { wrapper: Providers }
    );
    const label = getByTestId('AppButtonLabel');
    expect(label.props.numberOfLines).toBe(1);
    expect(label.props.children).toBe(longLabel);
  });

  it('respects fullWidth and flex', () => {
    const { getByTestId, rerender } = render(
      <AppButton label="FullWidth" fullWidth />, { wrapper: Providers }
    );
    let button = getByTestId('AppButton');
    expect(button.props.width || button.props.style?.width).toBe('100%');
    rerender(<AppButton label="Flex" flex={1} fullWidth={false} />, { wrapper: Providers });
    button = getByTestId('AppButton');
    expect(button.props.flex || button.props.style?.flex).toBe(1);
  });
});
