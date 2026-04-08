import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';
import { MiniPlayer } from '../MiniPlayer';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';

jest.mock('@/store/useActiveWorkout');
jest.mock('@/store/useRestTimer');
jest.mock('@/hooks/useMotion', () => ({
  useMotion: () => ({
    isReduced: false,
    timing: (duration: number) => ({ duration }),
    spring: (_preset: string) => ({ damping: 14, stiffness: 240, mass: 0.9 }),
    entering: (animation: unknown) => animation,
    exiting: (animation: unknown) => animation,
    semantic: (_type: string) => ({ duration: 220 }),
  }),
}));

jest.mock('lucide-react-native', () => ({
  ChevronRight: jest.fn(() => null),
  Activity: jest.fn(() => null),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  }
}));

const { router } = jest.requireMock('expo-router') as { router: { push: jest.Mock } };

jest.mock('@/utils/exercise', () => ({
  getExerciseName: jest.fn(() => 'Bench Press')
}));

const mockInactiveRestTimer = { isActive: false, endTime: null };

function mockZustandStore<T>(hook: any, state: T) {
  hook.mockImplementation((selector?: (s: T) => unknown) =>
    selector ? selector(state) : state
  );
}

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
    mockZustandStore(useRestTimer, mockInactiveRestTimer);
  });

  it('no renderiza cuando el entrenamiento esta inactivo', () => {
    mockZustandStore(useActiveWorkout, {
      isActive: false,
      workoutId: null,
      currentExerciseIndex: 0,
      exercises: [],
    });

    const { queryByText } = renderWithProviders(<MiniPlayer />);
    expect(queryByText('Bench Press')).toBeNull();
    expect(queryByText('Retomar')).toBeNull();
  });

  it('renderiza el ejercicio activo cuando hay un workout en curso', () => {
    mockZustandStore(useActiveWorkout, {
      isActive: true,
      workoutId: 'workout-1',
      currentExerciseIndex: 0,
      exercises: [{ exerciseId: '123' }],
    });

    const { getByText } = renderWithProviders(<MiniPlayer />);
    expect(getByText('Bench Press')).toBeTruthy();
    expect(getByText('Retomar')).toBeTruthy();
  });

  it('no rompe si no hay ejercicios', () => {
    mockZustandStore(useActiveWorkout, {
      isActive: true,
      workoutId: 'workout-1',
      currentExerciseIndex: 0,
      exercises: [],
    });

    const { queryByText } = renderWithProviders(<MiniPlayer />);
    expect(queryByText('Bench Press')).toBeNull();
  });

  it('navega al workout al presionar Retomar', () => {
    mockZustandStore(useActiveWorkout, {
      isActive: true,
      workoutId: 'workout-1',
      currentExerciseIndex: 0,
      exercises: [{ exerciseId: '123' }],
    });

    const { getByText } = renderWithProviders(<MiniPlayer />);
    fireEvent.press(getByText('Retomar'));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/(workouts)/[active]',
      params: { active: 'workout-1' },
    });
  });
});