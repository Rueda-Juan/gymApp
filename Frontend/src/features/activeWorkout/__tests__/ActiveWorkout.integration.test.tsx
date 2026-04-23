import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ActiveWorkoutPage from '@/pages/activeWorkout/ActiveWorkoutPage';
import { exerciseFactory, routineFactory } from '@/shared/lib/tests/factories';
import { useActiveWorkout } from '@/entities/workout';

import { Alert } from 'react-native';

// Mock simpler things that are outside our domain
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.spyOn(Alert, 'alert');

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        expand: jest.fn(),
        close: jest.fn(),
        snapToIndex: jest.fn(),
        collapse: jest.fn(),
      }));
      return <View testID={props.testID}>{props.children}</View>;
    }),
    BottomSheetView: ({ children }: any) => <View>{children}</View>,
    BottomSheetModal: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return <View testID={props.testID}>{props.children}</View>;
    }),
    BottomSheetModalProvider: ({ children }: any) => <View>{children}</View>,
    BottomSheetTextInput: (props: any) => <View {...props} />,
  };
});



// Mock Tamagui hooks that might fail in non-provider context
jest.mock('tamagui', () => {
  const actual = jest.requireActual('tamagui');
  return {
    ...actual,
    useTheme: () => ({
      primary: { val: '#E8762E', get: () => '#E8762E' },
      surfaceSecondary: { val: '#1E1B16', get: () => '#1E1B16' },
      borderColor: { val: 'rgba(255, 255, 255, 0.1)', get: () => 'rgba(255, 255, 255, 0.1)' },
      color: { val: '#FFFFFF', get: () => '#FFFFFF' },
      textSecondary: { val: '#A0A0A0', get: () => '#A0A0A0' },
      textTertiary: { val: '#606060', get: () => '#606060' },
      surface: { val: '#121212', get: () => '#121212' },
      danger: { val: '#FF4D4D', get: () => '#FF4D4D' },
    }),
  };
});

import { DIProvider } from '@/shared/context/DIContext';

describe('ActiveWorkout Integration Flow', () => {
  const exercises = exerciseFactory.buildList(2);
  const routine = routineFactory.build({ exercises: exercises.map((e, i) => ({ exerciseId: e.id, order: i })) });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Zustand store state before each test
    const { startWorkout } = useActiveWorkout.getState();
    startWorkout('test-workout-id', routine.id, routine.name, exercises.map(e => ({
      ...e,
      exerciseId: e.id,
      sets: [
        { id: 'set-1', reps: 10, weight: 60, isCompleted: false, type: 'normal' }
      ]
    })));
  });

  it('completes a full workout flow: mark sets -> navigate -> finish', async () => {
    const { getByText, getAllByTestId, queryByText } = render(
      <DIProvider>
        <ActiveWorkoutPage />
      </DIProvider>
    );

    // Wait for DIProvider to finish loading
    await waitFor(() => {
      expect(queryByText('Cargando dependencias...')).toBeNull();
    }, { timeout: 3000 });

    // 1. Initial State: First exercise
    expect(getByText(exercises[0].name)).toBeTruthy();

    
    // 2. Mark set as completed
    const setRows = getAllByTestId('workout-set-row');
    fireEvent.press(setRows[0]); // Toggle completion

    // 3. Navigate to next exercise
    fireEvent.press(getByText('Siguiente'));
    await waitFor(() => {
      expect(getByText(exercises[1].name)).toBeTruthy();
    });

    // 4. Finish workout
    fireEvent.press(getByText('Finalizar'));
    
    // Verify alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Finalizar entrenamiento',
      expect.any(String),
      expect.any(Array)
    );

    // Simulate clicking "Finalizar" in Alert
    const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const finishButton = alertButtons.find((b: any) => b.text === 'Finalizar');
    finishButton.onPress();

    // Verify cleanup
    expect(useActiveWorkout.getState().isActive).toBe(false);
  });

  it('allows canceling a workout session', async () => {
    const { getByText, queryByText } = render(
      <DIProvider>
        <ActiveWorkoutPage />
      </DIProvider>
    );

    await waitFor(() => {
      expect(queryByText('Cargando dependencias...')).toBeNull();
    });

    fireEvent.press(getByText('Cancelar'));


    expect(Alert.alert).toHaveBeenCalledWith(
      'Cancelar entrenamiento',
      expect.any(String),
      expect.any(Array)
    );

    const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
    const cancelButton = alertButtons.find((b: any) => b.text === 'Cancelar sesión');
    cancelButton.onPress();

    expect(useActiveWorkout.getState().isActive).toBe(false);
  });

  it('can add a new exercise during workout', async () => {
    const { getByText, queryByText } = render(
      <DIProvider>
        <ActiveWorkoutPage />
      </DIProvider>
    );

    await waitFor(() => {
      expect(queryByText('Cargando dependencias...')).toBeNull();
    });


    // Open options then picker
    // Since we mock BottomSheet, we just call the store or verify buttons exist
    // In a real integration test we'd need to trigger the specific button
    // For now, let's test the store logic directly as part of integration
    
    const newExercise = exerciseFactory.build({ name: 'New Exercise' });
    
    // Simulating what the picker would do
    useActiveWorkout.getState().addExercise({
      id: 'new-id',
      exerciseId: newExercise.id,
      name: newExercise.name,
      sets: [{ id: 's1', weight: 0, reps: 0, isCompleted: false, type: 'normal' }]
    });

    // Verify it appears (might need to navigate or it adds at end)
    const state = useActiveWorkout.getState();
    expect(state.exercises).toHaveLength(3);
    expect(state.exercises[2].name).toBe('New Exercise');
  });
});
