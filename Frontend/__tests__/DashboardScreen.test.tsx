import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../app/dashboard/DashboardScreen';

// Mock hooks y navegación si es necesario
jest.mock('../hooks/application/useDashboardStore', () => ({
  useDashboardStore: () => ({
    user: { name: 'Test' },
    activeWorkout: null,
    streakData: 5,
    routinesPreview: [],
  }),
}));
jest.mock('../hooks/application/useNetworkState', () => ({
  useNetworkState: () => ({ isOnline: true }),
}));

// Test de rendering de estados principales

describe('DashboardScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  // Puedes agregar más tests para empty, error, success, offline, refreshing
});
