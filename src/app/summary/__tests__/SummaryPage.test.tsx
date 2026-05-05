import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SummaryPage from '../index';
import { ROUTES } from '@/shared/constants/routes';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ id: 'test-workout-id' })),
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock lucide icons
jest.mock('lucide-react-native', () => ({
  CheckCircle2: 'CheckCircle2',
  Clock: 'Clock',
  Trophy: 'Trophy',
}));

// Mock entities
jest.mock('@/entities/workout', () => ({
  useActiveWorkout: jest.fn(() => ({
    activeWorkout: null,
  })),
}));

describe('SummaryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el título de éxito correctamente', () => {
    const { getByText } = render(<SummaryPage />);
    expect(getByText('¡Entrenamiento completado!')).toBeTruthy();
    expect(getByText('Buen trabajo. Tu esfuerzo de hoy suma para tus objetivos.')).toBeTruthy();
  });

  it('renderiza las tarjetas de resumen (Tiempo y Volumen)', () => {
    const { getByText } = render(<SummaryPage />);
    
    expect(getByText('TIEMPO')).toBeTruthy();
    expect(getByText('45m')).toBeTruthy();
    
    expect(getByText('VOLUMEN')).toBeTruthy();
    expect(getByText('12k kg')).toBeTruthy();
  });

  it('navega al historial al presionar el botón "Ver historial completo"', () => {
    const { getByText } = render(<SummaryPage />);
    const historyButton = getByText('Ver historial completo');
    
    fireEvent.press(historyButton);
    
    expect(router.replace).toHaveBeenCalledWith(ROUTES.HISTORY);
  });

  it('navega al inicio al presionar el botón "Volver al inicio"', () => {
    const { getByText } = render(<SummaryPage />);
    const homeButton = getByText('Volver al inicio');
    
    fireEvent.press(homeButton);
    
    expect(router.replace).toHaveBeenCalledWith(ROUTES.TABS_HOME);
  });

  it('utiliza el ID del workout de los parámetros de búsqueda', () => {
    render(<SummaryPage />);
    expect(useLocalSearchParams).toHaveBeenCalled();
  });
});
