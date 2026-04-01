import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';
import { MiniPlayer } from '../mini-player';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';

jest.mock('@/store/useActiveWorkout');
jest.mock('@/store/useRestTimer');

jest.mock('lucide-react-native', () => ({
  ChevronRight: jest.fn(() => null),
  Activity: jest.fn(() => null),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  }
}));

jest.mock('@/utils/exercise', () => ({
  getExerciseName: jest.fn(() => 'Bench Press')
}));

const mockInactiveRestTimer = { isActive: false, endTime: null };

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <TamaguiProvider config={config} defaultTheme="light">
        {component}
      </TamaguiProvider>
    </SafeAreaProvider>
  );
};

describe('MiniPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRestTimer as unknown as jest.Mock).mockImplementation((selector) =>
      selector(mockInactiveRestTimer)
    );
  });

  it('no renderiza cuando el entrenamiento esta inactivo', () => {
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        isActive: false,
        workoutId: null,
        currentExerciseIndex: 0,
        exercises: [],
      };
      return selector(state);
    });

    const { queryByText } = renderWithProviders(<MiniPlayer />);
    expect(queryByText('Bench Press')).toBeNull();
    expect(queryByText('Retomar')).toBeNull();
  });

  it('renderiza el ejercicio activo cuando hay un workout en curso', () => {
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        isActive: true,
        workoutId: 'workout-1',
        currentExerciseIndex: 0,
        exercises: [{ exerciseId: '123' }],
      };
      return selector(state);
    });

    const { getByText } = renderWithProviders(<MiniPlayer />);
    expect(getByText('Bench Press')).toBeTruthy();
    expect(getByText('Retomar')).toBeTruthy();
  });
});