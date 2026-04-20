import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { RoutinesScreen } from '../screens/RoutinesScreen';

describe('RoutinesScreen', () => {
  it('renders routines list', () => {
    render(<RoutinesScreen />);
    expect(screen.getByText(/routines/i)).toBeTruthy();
  });
});