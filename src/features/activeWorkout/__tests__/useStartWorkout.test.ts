import React from "react";
import { Alert } from "react-native";
import { render, act } from "@testing-library/react-native";
import { router } from "expo-router";
import { useWorkoutDb } from "@/entities/workout";
import { useActiveWorkout } from "@/entities/workout";
import { useStartWorkout } from "../hooks/useStartWorkout";

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));
jest.mock("@/entities/workout", () => ({
  useWorkoutDb: jest.fn(),
  useActiveWorkout: Object.assign(jest.fn(), { getState: jest.fn() }),
}));
jest.mock("@/shared/lib/clientId", () => {
  let counter = 0;
  return { createClientId: () => `client-${++counter}` };
});
jest.spyOn(Alert, "alert").mockImplementation(() => {});

const mockStartWorkout = jest.fn();
const mockStartActiveWorkout = jest.fn();

const ROUTINE = {
  id: "r-1",
  name: "Push Day",
  exercises: [
    {
      exercise: { id: "ex-1", name: "Bench Press", nameEs: "Press de Banca" },
      targetSets: 3,
      targetReps: "12",
    },
    {
      exercise: { id: "ex-2", name: "OHP", nameEs: null },
      targetSets: 2,
      targetReps: 10,
    },
  ],
};

function setupMocks(isActive = false) {
  (useWorkoutDb as jest.Mock).mockReturnValue({
    startWorkout: mockStartWorkout,
  });

  (useActiveWorkout as unknown as jest.Mock).mockReturnValue({
    startWorkout: mockStartActiveWorkout,
  });

  (useActiveWorkout as any).getState = jest.fn().mockReturnValue({ isActive });

  mockStartWorkout.mockResolvedValue({ id: "w-1" });
}

function renderHook(navigationMode: "push" | "replace" = "push") {
  let startFn: (routine: typeof ROUTINE) => Promise<void>;

  function TestComponent() {
    const start = useStartWorkout(navigationMode);
    startFn = start;
    return null;
  }

  render(React.createElement(TestComponent));
  return { getStart: () => startFn! };
}

describe("useStartWorkout", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Happy Path
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("happy path", () => {
    it("crea workout y navega con push por defecto", async () => {
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      expect(mockStartWorkout).toHaveBeenCalledWith("r-1");
      expect(mockStartActiveWorkout).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/(workouts)/[workoutId]",
          params: { workoutId: "w-1" },
        }),
      );
    });

    it("navega con replace cuando navigationMode es replace", async () => {
      const { getStart } = renderHook("replace");

      await act(async () => {
        await getStart()(ROUTINE);
      });

      expect(router.replace).toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });

    // MOVED: Este test fue migrado a features/workout/__tests__/useStartWorkout.test.ts

    it("parsea targetReps string a número", async () => {
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      const exercises = mockStartActiveWorkout.mock.calls[0][3];
      expect(exercises[0].sets[0].reps).toBe(12);
    });

    it("parsea targetReps numérico correctamente", async () => {
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      const exercises = mockStartActiveWorkout.mock.calls[0][3];
      expect(exercises[1].sets[0].reps).toBe(10);
    });
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // buildInitialExercises
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("buildInitialExercises", () => {
    it("filtra ejercicios sin objeto exercise", async () => {
      // Previene: crash si la rutina tiene un slot sin ejercicio asignado
      const routineWithNull = {
        ...ROUTINE,
        exercises: [
          ...ROUTINE.exercises,
          { exercise: undefined, targetSets: 3, targetReps: "10" },
        ],
      };

      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(routineWithNull as any);
      });

      const exercises = mockStartActiveWorkout.mock.calls[0][3];
      expect(exercises).toHaveLength(2);
    });

    it("genera sets con weight=0, isCompleted=false, type=normal", async () => {
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      const firstSet = mockStartActiveWorkout.mock.calls[0][3][0].sets[0];
      expect(firstSet.weight).toBe(0);
      expect(firstSet.isCompleted).toBe(false);
      expect(firstSet.type).toBe("normal");
    });

    it("targetReps no numérico fallback a 0", async () => {
      // Previene: NaN propagado como reps
      const routineWithBadReps = {
        ...ROUTINE,
        exercises: [
          {
            exercise: { id: "ex-1", name: "Test", nameEs: null },
            targetSets: 1,
            targetReps: "abc" as unknown as number,
          },
        ],
      };

      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(routineWithBadReps);
      });

      const sets = mockStartActiveWorkout.mock.calls[0][3][0].sets;
      expect(sets[0].reps).toBe(0);
    });
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Guard: workout activo
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("guard — workout activo", () => {
    it("muestra Alert y no crea workout si hay uno activo", async () => {
      setupMocks(true);
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        "Entreno en curso",
        expect.any(String),
      );
      expect(mockStartWorkout).not.toHaveBeenCalled();
    });
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Error handling
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("error handling", () => {
    it("muestra Alert de error si startWorkout falla", async () => {
      // Previene: error silencioso si el backend falla al crear workout
      mockStartWorkout.mockRejectedValue(new Error("DB error"));
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      expect(Alert.alert).toHaveBeenCalledWith("Error", expect.any(String));
    });

    it("no navega si startWorkout falla", async () => {
      mockStartWorkout.mockRejectedValue(new Error("DB error"));
      const { getStart } = renderHook();

      await act(async () => {
        await getStart()(ROUTINE);
      });

      expect(router.push).not.toHaveBeenCalled();
      expect(mockStartActiveWorkout).not.toHaveBeenCalled();
    });
  });
});

