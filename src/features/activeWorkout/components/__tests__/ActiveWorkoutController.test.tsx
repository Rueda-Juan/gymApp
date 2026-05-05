import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ActiveWorkoutController } from '../ActiveWorkoutController';
import { useActiveWorkout } from '@/entities/workout';
import { useActiveWorkoutController, useRestTimer } from '@/features/activeWorkout';

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
  };
});

const { Pressable } = require('react-native');

jest.mock('@/entities/workout', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    useActiveWorkout: jest.fn(),
    useWorkoutTimer: jest.fn(() => ({ formattedTime: '00:05:00' })),
    useWorkoutRepository: jest.fn(() => ({
      recordAllSets: jest.fn(),
      finishWorkout: jest.fn(),
    })),
    PlateCalculatorSheet: React.forwardRef((_props: unknown, ref: React.Ref<{ dismiss: () => void }>) => {
      React.useImperativeHandle(ref, () => ({ dismiss: jest.fn() }));
      return <View testID="plate-calculator" />;
    }),
    usePreviousSets: jest.fn(() => ({ resolvePreviousWeight: jest.fn() })),
  };
});

jest.mock('@/features/activeWorkout', () => {
  const { View } = require('react-native');
  return {
    useActiveWorkoutController: jest.fn(),
    useRestTimer: jest.fn(),
    ActiveWorkoutOptionsSheet: () => <View testID="options-sheet" />,
    ActiveWorkoutExercisePickerSheet: () => <View testID="picker-sheet" />,
    WorkoutSessionNoteSheet: () => <View testID="note-sheet" />,
    PRCelebrationOverlay: () => null,
  };
});

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
    (useActiveWorkoutController as unknown as jest.Mock).mockReturnValue({
      actions: mockActions,
      state: { ...mockState, isLast: true },
    });
    const { getByTestId } = render(<ActiveWorkoutController />);
    fireEvent.press(getByTestId('finish-workout-button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Finalizar entrenamiento',
      expect.any(String),
      expect.any(Array)
    );

    // Simular confirmación
    const confirmFinish = (Alert.alert as unknown as jest.Mock).mock.calls[0][2][1].onPress;
    await confirmFinish();

    expect(mockFinishWorkout).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/summary');
  });

  it('maneja la cancelación del entrenamiento con confirmación', async () => {
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

