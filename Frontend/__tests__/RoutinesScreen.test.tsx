import React from 'react';
import { render } from '@testing-library/react-native';
import RoutinesScreen from '../app/routines/RoutinesScreen';

describe('RoutinesScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<RoutinesScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
