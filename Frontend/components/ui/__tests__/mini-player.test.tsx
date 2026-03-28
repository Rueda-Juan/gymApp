import React from 'react';
import { render, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';
import { MiniPlayer } from '../mini-player';
import { useActiveWorkout } from '@/store/useActiveWorkout';

jest.mock('@/store/useActiveWorkout');

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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('no renderiza cuando el entrenamiento esta inactivo', () => {
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { isActive: false };
      return selector(state);
    });

    const { queryByText } = renderWithProviders(<MiniPlayer />);
    expect(queryByText('Sesión actual')).toBeNull();
    expect(queryByText('Bench Press')).toBeNull();
  });

  it('renderiza la rutina activa y calcula el tiempo transcurrido', () => {
    const mockStartTime = Date.now() - 5000;

    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        isActive: true,
        routineName: 'Push Day',
        startTime: mockStartTime,
        currentExerciseIndex: 0,
        exercises: [{ exerciseId: '123' }]
      };
      return selector(state);
    });

    const { getByText } = renderWithProviders(<MiniPlayer />);

    expect(getByText('Push Day')).toBeTruthy();
    expect(getByText('Bench Press')).toBeTruthy();
    expect(getByText('00:05')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('00:06')).toBeTruthy();
  });
});