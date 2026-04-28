import React from 'react';
import { render } from '@testing-library/react-native';
import { useDI } from '@/shared/context/DIContext';
import { useWorkout } from '../useWorkoutApi';
import type { WorkoutExerciseState } from '@/shared/types/workout';

jest.mock('@/shared/context/DIContext', () => ({ useDI: jest.fn() }));

const mockWorkoutService = {
  startWorkout: jest.fn(),
  finishWorkout: jest.fn(),
  deleteWorkout: jest.fn(),
  recordSet: jest.fn(),
  recordAllSets: jest.fn(),
  getPreviousSets: jest.fn(),
  updateSet: jest.fn(),
  deleteSet: jest.fn(),
  skipExercise: jest.fn(),
  addExerciseToWorkout: jest.fn(),
  reorderWorkoutExercises: jest.fn(),
  deleteWorkoutExercise: jest.fn(),
  updateWorkoutExercise: jest.fn(),
  suggestWeight: jest.fn(),
  suggestWarmup: jest.fn(),
  getHistory: jest.fn(),
  getById: jest.fn(),
};

function setupMocks() {
  // Wrap plain mock functions into use-case objects with an `execute` method
  const nameMapping: Record<string, string> = { getById: 'getWorkoutById', getHistory: 'getWorkoutHistory' };
  const useCases: Record<string, any> = {};
  Object.keys(mockWorkoutService).forEach((key) => {
    const mappedKey = nameMapping[key] || key;
    useCases[mappedKey] = { execute: (mockWorkoutService as any)[key] };
  });

  (useDI as jest.Mock).mockReturnValue(useCases);
}

function renderHook() {
  let result: ReturnType<typeof useWorkout>;

  function TestComponent() {
    result = useWorkout();
    return null;
  }

  render(React.createElement(TestComponent));
  return { getResult: () => result! };
}

function createExerciseState(overrides: Partial<WorkoutExerciseState> = {}): WorkoutExerciseState {
  return {
    id: 'we-1',
    exerciseId: 'ex-1',
    name: 'Bench Press',
    sets: [
      { id: 's-1', weight: 80, reps: 10, isCompleted: true, type: 'normal' },
      { id: 's-2', weight: 80, reps: 8, isCompleted: true, type: 'normal' },
      { id: 's-3', weight: 70, reps: 12, isCompleted: false, type: 'normal' },
    ],
    ...overrides,
  };
  }
  // MOVED: Este test fue migrado a features/workout/__tests__/useWorkout.test.ts

describe('useWorkout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // recordAllSets └─ mapExerciseStateToBackend
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe('recordAllSets — mapeo de estado a backend', () => {
    it('filtra sets incompletos', async () => {
      // Previene: enviar sets no completados al backend
      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [createExerciseState()]);

      const mappedExercises = mockWorkoutService.recordAllSets.mock.calls[0][1];
      expect(mappedExercises[0].sets).toHaveLength(2);
    });

    it('filtra sets con reps=0 aunque estén completados', async () => {
      // Previene: sets vacíos (reps=0) se graban como datos espurios
      const exercise = createExerciseState({
        sets: [
          { id: 's-1', weight: 80, reps: 10, isCompleted: true, type: 'normal' },
          { id: 's-2', weight: 0, reps: 0, isCompleted: true, type: 'normal' },
        ],
      });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [exercise]);

      const mappedSets = mockWorkoutService.recordAllSets.mock.calls[0][1][0].sets;
      expect(mappedSets).toHaveLength(1);
      expect(mappedSets[0].reps).toBe(10);
    });

    it('renumera setNumber secuencialmente tras filtrar', async () => {
      // Previene: setNumber con huecos (1, 3) en vez de (1, 2)
      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [createExerciseState()]);

      const mappedSets = mockWorkoutService.recordAllSets.mock.calls[0][1][0].sets;
      expect(mappedSets[0].setNumber).toBe(1);
      expect(mappedSets[1].setNumber).toBe(2);
    });

    it('mapea el status skipped correctamente', async () => {
      const skippedExercise = createExerciseState({
        status: 'skipped',
        sets: [{ id: 's-1', weight: 80, reps: 10, isCompleted: true, type: 'normal' }],
      });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [skippedExercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].skipped).toBe(true);
    });

    it('ejercicio no skipped mapea skipped=false', async () => {
      const activeExercise = createExerciseState({ status: 'active' });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [activeExercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].skipped).toBe(false);
    });

    it('mapea orderIndex según posición en el array', async () => {
      const ex1 = createExerciseState({ id: 'we-1', exerciseId: 'ex-1' });
      const ex2 = createExerciseState({ id: 'we-2', exerciseId: 'ex-2' });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [ex1, ex2]);

      const mapped = mockWorkoutService.recordAllSets.mock.calls[0][1];
      expect(mapped[0].orderIndex).toBe(0);
      expect(mapped[1].orderIndex).toBe(1);
    });

    it('mapea supersetGroup null cuando no existe', async () => {
      const exercise = createExerciseState({ supersetGroup: undefined });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [exercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].supersetGroup).toBeNull();
    });

    it('mapea supersetGroup numérico', async () => {
      const exercise = createExerciseState({ supersetGroup: 2 });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [exercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].supersetGroup).toBe(2);
    });

    it('mapea rir null cuando no existe', async () => {
      const exercise = createExerciseState({
        sets: [{ id: 's-1', weight: 80, reps: 10, isCompleted: true, type: 'normal' }],
      });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [exercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].sets[0].rir).toBeNull();
    });

    it('mapea rir con valor numérico', async () => {
      const exercise = createExerciseState({
        sets: [{ id: 's-1', weight: 80, reps: 10, isCompleted: true, type: 'normal', rir: 2 }],
      });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [exercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].sets[0].rir).toBe(2);
    });

    it('ejercicio sin sets completados resulta en sets vacío', async () => {
      // Previene: error al enviar ejercicios vacíos
      const exercise = createExerciseState({
        sets: [
          { id: 's-1', weight: 80, reps: 10, isCompleted: false, type: 'normal' },
        ],
      });

      const { getResult } = renderHook();
      mockWorkoutService.recordAllSets.mockResolvedValue(undefined);

      await getResult().recordAllSets('w-1', [exercise]);

      expect(mockWorkoutService.recordAllSets.mock.calls[0][1][0].sets).toHaveLength(0);
    });
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Delegación a servicio
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe('delegación a servicio', () => {
    it('startWorkout delega al servicio', async () => {
      const { getResult } = renderHook();
      mockWorkoutService.startWorkout.mockResolvedValue({ id: 'w-1' });

      await getResult().startWorkout('r-1');

      expect(mockWorkoutService.startWorkout).toHaveBeenCalledWith('r-1');
    });

    it('finishWorkout delega al servicio', async () => {
      const { getResult } = renderHook();

      await getResult().finishWorkout('w-1');

      expect(mockWorkoutService.finishWorkout).toHaveBeenCalledWith('w-1');
    });

    it('deleteWorkout delega al servicio', async () => {
      const { getResult } = renderHook();

      await getResult().deleteWorkout('w-1');

      expect(mockWorkoutService.deleteWorkout).toHaveBeenCalledWith('w-1');
    });

    it('suggestWeight delega al servicio', async () => {
      const { getResult } = renderHook();

      await getResult().suggestWeight('ex-1');

      expect(mockWorkoutService.suggestWeight).toHaveBeenCalledWith('ex-1');
    });
  });
});
