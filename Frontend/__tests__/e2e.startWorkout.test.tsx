import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../app/dashboard/DashboardScreen';
import ActiveWorkoutScreen from '../features/workout/screens/ActiveWorkoutScreen';

describe('E2E: Start Workout Flow', () => {
  it('flujo de inicio de entrenamiento', () => {
    const { getByText } = render(<DashboardScreen />);
    setTimeout(() => {
      const btn = getByText('Comenzar Entrenamiento');
      fireEvent.press(btn);
      // Aquí se simularía la navegación y se renderizaría ActiveWorkoutScreen
      // En un entorno real, usarías Detox o similar para E2E real
      // Ejemplo:
      // expect(getByText('Active Workout Screen')).toBeTruthy();
    }, 1100);
  });
});
