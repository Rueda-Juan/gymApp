import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react-native';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { router } from 'expo-router';
import { useSetCompletion } from '../useSetCompletion';
import { useWorkout } from '../useWorkout';

jest.mock('@/store/useActiveWorkout');
jest.mock('@/store/useRestTimer');
jest.mock('@/store/useSettings');
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('../useWorkout', () => ({ useWorkout: jest.fn() }));


describe('useSetCompletion', () => {
  const baseState = {
    workoutId: 'workout-1',
    exercises: [
      {
        id: 'ex-1',
        exerciseId: 'exercise-10',
        name: 'Bench Press',
        sets: [
          { id: 'set-1', weight: 80, reps: 8, isCompleted: false, type: 'normal' },
        ],
      },
    ],
    toggleSetComplete: jest.fn(),
  };

  const startTimer = jest.fn();
  const recordSet = jest.fn(async () => ({ isPR: false }));

  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => selector(baseState));
    (useRestTimer as unknown as jest.Mock).mockReturnValue({ startTimer });
    (useSettings as unknown as jest.Mock).mockImplementation((selector) => selector({ restTimerSeconds: 60 }));
    const useWorkoutMock = require('../useWorkout').useWorkout as jest.Mock;
    useWorkoutMock.mockReturnValue({ recordSet });
  });

  it('starts rest timer and navigates when set is completed and it is newly completed', async () => {
    let completeSetFn: any;
    function TestComponent() {
      const { completeSet } = useSetCompletion();
      useEffect(() => {
        completeSetFn = completeSet;
      }, [completeSet]);
      return null;
    }

    render(React.createElement(TestComponent));

    let result: any;
    await act(async () => {
      result = await completeSetFn('ex-1', 'set-1', false);
    });

    expect(baseState.toggleSetComplete).toHaveBeenCalledWith('ex-1', 'set-1');
    expect(recordSet).toHaveBeenCalledWith(
      'workout-1',
      expect.objectContaining({
        exerciseId: 'exercise-10',
        setNumber: 1,
        weight: 80,
        reps: 8,
        setType: 'normal',
        rir: null,
        restSeconds: null,
        durationSeconds: 0,
        completed: true,
        skipped: false,
        id: 'set-1',
      })
    );
    expect(startTimer).toHaveBeenCalledWith(60);
    expect(router.push).toHaveBeenCalledWith('/(workouts)/rest-timer');
    expect(result).toEqual({ isPR: false, exerciseName: 'Bench Press' });
  });

  it('does not start timer when set is already completed', async () => {
    let completeSetFn: any;
    function TestComponent() {
      const { completeSet } = useSetCompletion();
      useEffect(() => {
        completeSetFn = completeSet;
      }, [completeSet]);
      return null;
    }

    render(React.createElement(TestComponent));

    await act(async () => {
      await completeSetFn('ex-1', 'set-1', true);
    });

    expect(baseState.toggleSetComplete).toHaveBeenCalledWith('ex-1', 'set-1');
    expect(startTimer).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });
});
