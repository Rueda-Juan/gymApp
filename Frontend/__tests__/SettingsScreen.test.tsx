import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '../app/settings/SettingsScreen';

describe('SettingsScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
