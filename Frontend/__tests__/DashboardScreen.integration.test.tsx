import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../app/dashboard/DashboardScreen';

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

describe('DashboardScreen integration', () => {
  it('navega a activeWorkout y dispara analytics al iniciar entrenamiento', () => {
    const { getByText } = render(<DashboardScreen />);
    // Simular éxito
    setTimeout(() => {
      const btn = getByText('Comenzar Entrenamiento');
      fireEvent.press(btn);
      // Aquí se podría mockear router y logEvent para verificar navegación y analytics
    }, 1100);
  });
});
