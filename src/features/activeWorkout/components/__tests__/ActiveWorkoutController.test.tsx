import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ActiveWorkoutController } from '../ActiveWorkoutController';
import { useActiveWorkout } from '@/entities/workout';
import { useActiveWorkoutController } from '../../hooks/useActiveWorkoutController';
import { useRestTimer } from '../../model/useRestTimer';

// Mocks
// expo-router is mocked globally in jest.setup.js


jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock('@/shared/ui', () => {
  const { View, Text, Pressable } = require('react-native');
  return {
    Screen: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    AppText: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
    AppIcon: () => null,
    IconButton: ({ icon, onPress, accessibilityLabel }: { icon: React.ReactNode, onPress: () => void, accessibilityLabel: string }) => (
      <Pressable onPress={onPress} testID={accessibilityLabel}>
        {icon}
        <Text>{accessibilityLabel}</Text>
      </Pressable>
    ),
    AppButton: ({ label, onPress, testID }: { label: string, onPress: () => void, testID?: string }) => (
      <Pressable onPress={onPress} testID={testID}><Text>{label}</Text></Pressable>
    ),
    SearchBar: () => null,
    ToggleChip: () => null,
    CardBase: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    ContentReveal: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    useBottomSheetStyles: () => ({ backgroundStyle: {}, handleIndicatorStyle: {} }),
    Badge: ({ label }: { label: string }) => <Text>{label}</Text>,
    Collapsible: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

const { Pressable } = require('react-native');

jest.mock('@/entities/workout', () => {
  const React = require('react');
  const { View } = require('react-native');
  const mockFn = jest.fn();
  Object.assign(mockFn, {
    getState: jest.fn(() => ({
      updateSetValues: jest.fn(),
      addExercise: jest.fn(),
      removeExercise: jest.fn(),
      moveExerciseToEnd: jest.fn(),
      replaceExercise: jest.fn(),
    })),
  });

  return {
    useActiveWorkout: mockFn,
    useWorkoutTimer: jest.fn(() => ({ formattedTime: '00:05:00' })),
    useWorkoutDb: jest.fn(() => ({
      recordAllSets: jest.fn(),
      finishWorkout: jest.fn(),
      suggestWeight: jest.fn().mockResolvedValue(null),
    })),
    PlateCalculatorSheet: React.forwardRef((_props: unknown, ref: React.Ref<{ dismiss: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ dismiss: jest.fn() }));
      return <View testID="plate-calculator" />;
    }),
    usePreviousSets: jest.fn(() => ({ resolvePreviousWeight: jest.fn() })),
  };
});

jest.mock('../../hooks/useActiveWorkoutController', () => ({
  useActiveWorkoutController: jest.fn(),
}));

jest.mock('../../model/useRestTimer', () => ({
  useRestTimer: jest.fn(),
}));

jest.mock('@/features/activeWorkout', () => {
  const { View } = require('react-native');
  return {
    ActiveWorkoutOptionsSheet: () => <View testID="options-sheet" />,
    ActiveWorkoutExercisePickerSheet: () => <View testID="picker-sheet" />,
    WorkoutSessionNoteSheet: () => <View testID="note-sheet" />,
    PRCelebrationOverlay: () => null,
    ActiveWorkoutBottomBar: (props: any) => {
      const { View, Text, Pressable } = require('react-native');
      return (
        <View testID="ActiveWorkoutBottomBar">
          <Pressable accessibilityLabel="Calculadora de discos" onPress={props.onOpenPlateCalculator}><View /></Pressable>
          <View>
            <Pressable accessibilityLabel="Ejercicio anterior" disabled={props.isFirst} onPress={props.onPrev}><View /></Pressable>
            <Pressable accessibilityLabel="Nota de sesión" onPress={props.onOpenNote}><View /></Pressable>
            <Pressable accessibilityLabel="Abrir timer de descanso" onPress={props.onOpenRestTimer}><View><View /></View></Pressable>
            <Pressable testID={props.isLast ? "finish-workout-button" : "next-exercise-button"} onPress={props.isLast ? props.onFinish : props.onNext}>
              <Text>{props.isLast ? "Finalizar" : "Sig. Ejercicio"}</Text>
            </Pressable>
          </View>
          {props.nextExerciseName && !props.isLast && (
            <View><View><Text>PRÓXIMO: <Text>{props.nextExerciseName}</Text></Text></View></View>
          )}
        </View>
      );
    },
    ActiveWorkoutExerciseDetail: () => <View />,
  };
});

jest.mock('@/entities/stats', () => ({
  useStatsProcessor: jest.fn(() => ({
    processWorkoutStats: jest.fn(),
  })),
  useAchievementEvaluator: jest.fn(() => ({
    evaluateSet: jest.fn(),
  })),
}));

jest.mock('@/entities/settings', () => ({
  useSettings: jest.fn((selector) => selector({
    restTimerSeconds: 90,
    availablePlates: [20, 15, 10, 5, 2.5, 1.25],
  })),
  useSensoryFeedback: jest.fn(() => ({
    triggerSuccess: jest.fn(),
    triggerImpact: jest.fn(),
  })),
}));

describe('ActiveWorkoutController', () => {
  const mockExercises = [
    { exerciseId: '1', name: 'Press de Banca', sets: [] },
    { exerciseId: '2', name: 'Sentadilla', sets: [] },
  ];

  const mockFinishWorkout = jest.fn();
  const mockCancelWorkout = jest.fn();
  const mockSetSessionNote = jest.fn();
  const mockStopTimer = jest.fn();

  const mockState = {
    optionsSheetRef: { current: { expand: jest.fn(), close: jest.fn() } },
    bottomSheetRef: { current: { expand: jest.fn(), close: jest.fn() } },
    noteSheetRef: { current: { expand: jest.fn(), close: jest.fn() } },
    plateCalcSheetRef: { current: { dismiss: jest.fn() } },
    isFirst: true,
    isLast: false,
    weightSuggestion: null,
    focusedSetId: null,
    allExercises: [],
    search: '',
    filteredExercises: [],
  };

  const mockActions = {
    skipExercise: jest.fn(),
    updateSetValues: jest.fn(),
    onSetToggle: jest.fn(),
    addSet: jest.fn(),
    goToPrev: jest.fn(),
    goToNext: jest.fn(),
    handleOpenRestTimer: jest.fn(),
    openPlateCalculator: jest.fn(),
    setSearch: jest.fn(),
    handleAddExerciseSelection: jest.fn(),
    moveExerciseToEnd: jest.fn(),
    removeExercise: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => selector({
      isActive: true,
      workoutId: 'workout-123',
      routineName: 'Rutina Alpha',
      exercises: mockExercises,
      currentExerciseIndex: 0,
      sessionNote: '',
      setSessionNote: mockSetSessionNote,
      finishWorkout: mockFinishWorkout,
      cancelWorkout: mockCancelWorkout,
    }));
    (useRestTimer as unknown as jest.Mock).mockImplementation((selector) => selector({
      isActive: false,
      getRemainingSeconds: () => 0,
    }));
    (useRestTimer as any).getState = jest.fn(() => ({ stopTimer: mockStopTimer }));
    (useActiveWorkoutController as unknown as jest.Mock).mockReturnValue({
      actions: mockActions,
      state: mockState,
    });
    jest.spyOn(Alert, 'alert');
  });

  it('no renderiza nada si no hay entrenamiento activo', () => {
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => selector({ 
      isActive: false,
      exercises: [],
      currentExerciseIndex: 0
    }));
    const { toJSON } = render(<ActiveWorkoutController />);
    expect(toJSON()).toBeNull();
  });

  it('renderiza el entrenamiento activo correctamente', () => {
    const { getByText } = render(<ActiveWorkoutController />);
    expect(getByText('Press de Banca')).toBeTruthy();
  });

  it('maneja la finalización del entrenamiento con confirmación', async () => {
    (useActiveWorkoutController as jest.Mock).mockReturnValue({
      state: { ...mockState, isLast: true },
      actions: mockActions,
    });
    const { getByTestId } = render(<ActiveWorkoutController />);
    fireEvent.press(getByTestId('finish-workout-button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Finalizar entrenamiento',
      expect.any(String),
      expect.any(Array)
    );
  });

  it('maneja la cancelación del entrenamiento con confirmación', async () => {
    (useActiveWorkoutController as jest.Mock).mockReturnValue({
      state: mockState,
      actions: mockActions,
    });
    const { getByTestId } = render(<ActiveWorkoutController />);
    fireEvent.press(getByTestId('Cancelar entrenamiento'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Cancelar entrenamiento',
      expect.any(String),
      expect.any(Array)
    );

    // Simular confirmación
    const confirmCancel = (Alert.alert as unknown as jest.Mock).mock.calls[0][2][1].onPress;
    confirmCancel();

    expect(mockCancelWorkout).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/');
  });
});

