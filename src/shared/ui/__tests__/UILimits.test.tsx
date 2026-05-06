import React from 'react';
import { render } from '@testing-library/react-native';
import { AppText } from '../AppText';
import { AppButton } from '../AppButton';
import { TamaguiProvider } from 'tamagui';
import config from '../theme/tamagui.config';

describe('UI Limits and Stress Testing', () => {
  const LongText = 'A'.repeat(1000);

  it('renders AppText with extremely long content without crashing', () => {
    const { getByText } = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <AppText>{LongText}</AppText>
      </TamaguiProvider>
    );
    expect(getByText(LongText)).toBeTruthy();
  });

  it('renders AppButton with extremely long label', () => {
    const { getByText } = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <AppButton label={LongText} />
      </TamaguiProvider>
    );
    expect(getByText(LongText)).toBeTruthy();
  });
});
