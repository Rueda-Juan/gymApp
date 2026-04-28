import type * as SQLite from "expo-sqlite";
import { WorkoutService } from "../workout.service";
import type { WorkoutRepository, Workout, WorkoutExercise } from '@entities/workout';
import type { StatsRepository } from '@entities/stats';
import type { ExerciseLoadCacheRepository } from '@entities/exercise';
import type { RoutineRepository } from '@entities/routine';
import { ValidationError } from "@core/errors/errors";

const mockDb = {
  withTransactionAsync: jest.fn(async (cb: () => Promise<void>) => cb()),
} as unknown as SQLite.SQLiteDatabase;

describe("WorkoutService - RecordAllSets", () => {
  let service: WorkoutService;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockLoadCacheRepo: jest.Mocked<ExerciseLoadCacheRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      getById: jest.fn(),
      addSet: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockStatsRepo = {
      getExerciseStats: jest.fn(),
      updateExerciseStats: jest.fn(),
      savePersonalRecord: jest.fn(),
      getDailyStats: jest.fn(),
      upsertDailyStats: jest.fn(),
    } as unknown as jest.Mocked<StatsRepository>;

    mockLoadCacheRepo = {
      invalidateAll: jest.fn(),
      invalidate: jest.fn(),
    } as unknown as jest.Mocked<ExerciseLoadCacheRepository>;

    service = new WorkoutService(
      mockWorkoutRepo,
      mockStatsRepo,
      mockLoadCacheRepo,
      {} as unknown as RoutineRepository,
      mockDb,
    );
  });

  it("retorna newRecords vacíos si no hay sets completados", async () => {
    mockWorkoutRepo.getById.mockResolvedValue({
      id: "w-1",
      exercises: [],
    } as unknown as Workout);
    const result = await service.recordAllSets("w-1", []);
    expect(result.newRecords).toHaveLength(0);
    expect(mockDb.withTransactionAsync).not.toHaveBeenCalled();
  });

  it("lanza ValidationError si el workout ya tiene sets registrados", async () => {
    mockWorkoutRepo.getById.mockResolvedValue({
      id: "w-1",
      exercises: [{ sets: [{ id: "s-1" }] }],
    } as unknown as Workout);

    await expect(service.recordAllSets("w-1", [])).rejects.toThrow(
      ValidationError,
    );
  });

  it("procesa múltiples ejercicios y detecta PRs correctamente", async () => {
    mockWorkoutRepo.getById.mockResolvedValue({
      id: "w-1",
      exercises: [],
    } as unknown as Workout);
    mockStatsRepo.getExerciseStats.mockResolvedValue(null); // No previous stats

    const exercises: WorkoutExercise[] = [
      {
        id: "we-1",
        exerciseId: "ex-1",
        orderIndex: 0,
        skipped: false,
        notes: null,
        supersetGroup: null,
        sets: [
          {
            id: "s-1",
            exerciseId: "ex-1",
            weight: 100,
            reps: 10,
            completed: true,
            setNumber: 1,
            setType: "normal",
            createdAt: new Date(),
            partialReps: null,
            rir: null,
            restSeconds: null,
            durationSeconds: 0,
            skipped: false,
          },
        ],
      },
    ];

    const result = await service.recordAllSets("w-1", exercises);

    // Debe haber PRs porque no había stats previas
    expect(result.newRecords.length).toBeGreaterThan(0);
    expect(mockWorkoutRepo.addSet).toHaveBeenCalledTimes(1);
    expect(mockStatsRepo.savePersonalRecord).toHaveBeenCalled();
    expect(mockStatsRepo.upsertDailyStats).toHaveBeenCalled();
    expect(mockDb.withTransactionAsync).toHaveBeenCalled();
  });

  it("acumula volumen de múltiples ejercicios en daily_stats", async () => {
    mockWorkoutRepo.getById.mockResolvedValue({
      id: "w-1",
      exercises: [],
    } as unknown as Workout);
    mockStatsRepo.getExerciseStats.mockResolvedValue(null);
    mockStatsRepo.getDailyStats.mockResolvedValue({
      date: "2026-03-24",
      totalVolume: 1000,
      totalSets: 10,
      totalReps: 100,
      workoutCount: 1,
      totalDuration: 0,
    });

    const exercises: WorkoutExercise[] = [
      {
        id: "we-1",
        exerciseId: "ex-1",
        orderIndex: 0,
        skipped: false,
        notes: null,
        supersetGroup: null,
        sets: [
          {
            id: "s-1",
            exerciseId: "ex-1",
            weight: 100,
            reps: 10,
            completed: true,
            setNumber: 1,
            setType: "normal",
            createdAt: new Date(),
            partialReps: null,
            rir: null,
            restSeconds: null,
            durationSeconds: 0,
            skipped: false,
          },
        ],
      },
    ];

    await service.recordAllSets("w-1", exercises);

    // 100 * 10 = 1000 de volumen nuevo. Total debe ser 2000.
    expect(mockStatsRepo.upsertDailyStats).toHaveBeenCalledWith(
      expect.objectContaining({
        totalVolume: 2000,
        totalSets: 11,
        totalReps: 110,
        workoutCount: 2,
      }),
    );
  });
});
