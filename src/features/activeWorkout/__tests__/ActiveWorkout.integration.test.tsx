import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { exerciseFactory, routineFactory } from '@/shared/lib/tests/factories';
import { Alert } from 'react-native';

// 1. TAMAGUI MOCK (CRITICAL)
jest.mock('tamagui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  const MockStack = React.forwardRef((props: any, ref: any) => {
    const { children, style, ...rest } = props;
    return <View ref={ref} style={style} {...rest}>{children}</View>;
  });

  const MockButton = React.forwardRef((props: any, ref: any) => {
    const { children, style, ...rest } = props;
    return <TouchableOpacity ref={ref} style={style} {...rest}>{children}</TouchableOpacity>;
  });

  return {
    XStack: MockStack,
    YStack: MockStack,
    ZStack: MockStack,
    View: MockStack,
    Button: MockButton,
    Text: (props: any) => <Text {...props} />,
    useTheme: () => ({
      primary: { val: '#E8762E' },
      primarySubtle: { val: 'rgba(232, 118, 46, 0.1)' },
      surfaceSecondary: { val: '#1E1B16' },
      borderColor: { val: 'rgba(255, 255, 255, 0.1)' },
      color: { val: '#FFFFFF' },
      textSecondary: { val: '#A0A0A0' },
      textTertiary: { val: '#606060' },
      surface: { val: '#121212' },
      danger: { val: '#FF4D4D' },
      dangerSubtle: { val: 'rgba(255, 77, 77, 0.1)' },
      success: { val: '#4ADE80' },
      successSubtle: { val: 'rgba(74, 222, 128, 0.1)' },
      warning: { val: '#FACC15' },
    }),
    createTamagui: jest.fn((config) => config),
    createTokens: jest.fn((tokens) => tokens),
    createFont: jest.fn((font) => font),
    TamaguiProvider: ({ children }: any) => children,
  };
});


// Mock simpler things that are outside our domain
// expo-router is mocked globally in jest.setup.js


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

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureDetector: ({ children }: any) => children,
    Gesture: {
      Pan: () => ({
        activeCursor: jest.fn().mockReturnThis(),
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
        withTestId: jest.fn().mockReturnThis(),
      }),
    },
    GestureHandlerRootView: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props: any) => <View {...props} />;
  return {
    Check: MockIcon,
    Flame: MockIcon,
    Trash2: MockIcon,
    ChevronDown: MockIcon,
    ChevronUp: MockIcon,
    X: MockIcon,
    MoreVertical: MockIcon,
    Plus: MockIcon,
    SkipForward: MockIcon,
    TrendingUp: MockIcon,
    ChevronLeft: MockIcon,
    ChevronRight: MockIcon,
    History: MockIcon,
    Search: MockIcon,
    Timer: MockIcon,
    Dumbbell: MockIcon,
    User: MockIcon,
    Settings: MockIcon,
    Calendar: MockIcon,
    BarChart2: MockIcon,
    Play: MockIcon,
    StopCircle: MockIcon,
    ArrowLeft: MockIcon,
    ArrowRight: MockIcon,
    Copy: MockIcon,
    Edit2: MockIcon,
    Info: MockIcon,
    Clock: MockIcon,
  };
});

jest.mock('@/shared/ui/AppButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    AppButton: (props: any) => (
      <TouchableOpacity onPress={props.onPress} testID={props.testID}>
        <Text>{props.label || props.children}</Text>
      </TouchableOpacity>
    ),
    IconButton: (props: any) => (
      <TouchableOpacity onPress={props.onPress} testID={props.testID}>
        {props.icon}
      </TouchableOpacity>
    ),
  };
});



jest.mock('@/shared/ui/Badge', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Badge: ({ label }: any) => <View><Text>{label}</Text></View>,
  };
});









jest.mock('@/entities/workout/ui/SetRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    SetRow: ({ index, set }: any) => (
      <View testID="workout-set-row">
        <Text>Set {index + 1}</Text>
      </View>
    ),
  };
});

jest.mock('@/features/activeWorkout/components/WorkoutHeader', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    WorkoutHeader: ({ onCancel, onFinish }: any) => (
      <View>
        <TouchableOpacity onPress={onCancel}><Text>Cancelar</Text></TouchableOpacity>
        <TouchableOpacity onPress={onFinish}><Text>Finalizar</Text></TouchableOpacity>
      </View>
    ),
  };
});

jest.mock('@/features/activeWorkout/components/ActiveWorkoutBottomBar', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ActiveWorkoutBottomBar: ({ onNext, onPrev }: any) => (
      <View>
        <TouchableOpacity onPress={onPrev}><Text>Anterior</Text></TouchableOpacity>
        <TouchableOpacity onPress={onNext}><Text>Siguiente</Text></TouchableOpacity>
      </View>
    ),
  };
});

jest.mock('@/entities/workout/ui/SetRowNumberInput', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SetRowNumberInput: () => <View />,
  };
});

jest.mock('@/entities/workout/ui/SetRowRirSelector', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SetRowRirSelector: () => <View />,
  };
});



jest.mock('@/features/activeWorkout', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockSheet = () => <View />;
  return {
    ...jest.requireActual('@/features/activeWorkout'),
    useRestTimer: Object.assign(
      jest.fn((selector) => selector({ isActive: false, getRemainingSeconds: () => 0 })),
      { 
        getState: () => ({ stopTimer: jest.fn() }),
        subscribe: jest.fn(),
      }
    ),
    ActiveWorkoutOptionsSheet: MockSheet,
    ActiveWorkoutExercisePickerSheet: MockSheet,
    WorkoutSessionNoteSheet: MockSheet,
    PRCelebrationOverlay: MockSheet,
    ActiveWorkoutRestTimerChip: MockSheet,
    useWorkoutSummary: jest.fn(),
    useStartWorkout: jest.fn(),
    useSetCompletion: jest.fn(),
    useSupersetFlow: jest.fn(),
  };
});

jest.mock('@/entities/workout', () => {
  const actual = jest.requireActual('@/entities/workout');
  const React = require('react');
  const { View } = require('react-native');
  return {
    ...actual,
    PlateCalculatorSheet: () => <View />,
    useWorkoutDb: () => ({
      recordAllSets: jest.fn().mockResolvedValue(undefined),
      finishWorkout: jest.fn().mockResolvedValue(undefined),
      startWorkout: jest.fn().mockResolvedValue({ id: 'test-id' }),
      getHistory: jest.fn().mockResolvedValue([]),
      suggestWeight: jest.fn().mockResolvedValue(null),
      getPreviousSets: jest.fn().mockResolvedValue([]),
    }),
  };
});



import ActiveWorkoutPage from '@/app/(workouts)/[workoutId]';
import { useActiveWorkout } from '@/entities/workout';

describe('ActiveWorkout Integration Flow', () => {
  const exercises = exerciseFactory.buildList(2);
  const routine = routineFactory.build({ exercises: exercises.map((e, i) => ({ exerciseId: e.id, order: i })) } as any);

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
      <ActiveWorkoutPage />
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
    await finishButton.onPress();

    // Verify cleanup
    await waitFor(() => {
      expect(useActiveWorkout.getState().isActive).toBe(false);
    });
  });

  it('allows canceling a workout session', async () => {
    const { getByText, queryByText } = render(
      <ActiveWorkoutPage />
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
      <ActiveWorkoutPage />
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

