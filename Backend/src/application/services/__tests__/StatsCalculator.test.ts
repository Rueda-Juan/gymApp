import {
  calculateEstimated1RM,
  calculateSetVolume,
  computeUpdatedExerciseStats,
  detectBrokenRecords,
} from '../StatsCalculator';
import type { WorkoutSet } from '../../../domain/entities/WorkoutSet';
import type { ExerciseStats } from '../../../domain/entities/ExerciseStats';

describe('StatsCalculator', () => {
  // --- calculateEstimated1RM ---

  describe('calculateEstimated1RM', () => {
    it('should return 0 when weight is 0', () => {
      expect(calculateEstimated1RM(0, 10)).toBe(0);
    });

    it('should return 0 when reps is 0', () => {
      expect(calculateEstimated1RM(100, 0)).toBe(0);
    });

    it('should return the weight itself for 1 rep', () => {
      expect(calculateEstimated1RM(100, 1)).toBe(100);
    });

    it('should calculate Epley formula correctly for 100kg × 8reps', () => {
      // Epley: 100 * (1 + 8/30) = 100 * 1.2667 = 126.67
      expect(calculateEstimated1RM(100, 8)).toBeCloseTo(126.67, 1);
    });

    it('should calculate Epley formula correctly for 60kg × 12reps', () => {
      // Epley: 60 * (1 + 12/30) = 60 * 1.4 = 84
      expect(calculateEstimated1RM(60, 12)).toBe(84);
    });
  });

  // --- calculateSetVolume ---

  describe('calculateSetVolume', () => {
    it('should return weight × reps', () => {
      expect(calculateSetVolume(100, 8)).toBe(800);
    });

    it('should return 0 when either value is 0', () => {
      expect(calculateSetVolume(0, 10)).toBe(0);
      expect(calculateSetVolume(100, 0)).toBe(0);
    });
  });

  // --- computeUpdatedExerciseStats ---

  describe('computeUpdatedExerciseStats', () => {
    const baseSet: WorkoutSet = {
      id: 'set-1',
      exerciseId: 'ex-1',
      setNumber: 1,
      weight: 100,
      reps: 8,
      rir: null,
      restSeconds: null,
      setType: 'normal',
      durationSeconds: 0,
      completed: true,
      skipped: false,
      createdAt: new Date('2026-01-15T10:00:00Z'),
    };

    it('should create new stats when current is null', () => {
      const result = computeUpdatedExerciseStats(null, 'ex-1', baseSet);

      expect(result.exerciseId).toBe('ex-1');
      expect(result.maxWeight).toBe(100);
      expect(result.maxVolume).toBe(800);
      expect(result.maxReps).toBe(8);
      expect(result.totalSets).toBe(1);
      expect(result.totalReps).toBe(8);
      expect(result.totalVolume).toBe(800);
    });

    it('should accumulate stats when current exists', () => {
      const current: ExerciseStats = {
        exerciseId: 'ex-1',
        maxWeight: 80,
        maxVolume: 640,
        maxReps: 12,
        estimated1RM: 100,
        totalSets: 5,
        totalReps: 40,
        totalVolume: 3200,
        lastPerformed: new Date('2026-01-14'),
        updatedAt: new Date('2026-01-14'),
      };

      const result = computeUpdatedExerciseStats(current, 'ex-1', baseSet);

      expect(result.maxWeight).toBe(100); // New max
      expect(result.maxVolume).toBe(800); // New max
      expect(result.maxReps).toBe(12); // Kept existing
      expect(result.totalSets).toBe(6);
      expect(result.totalReps).toBe(48);
      expect(result.totalVolume).toBe(4000);
    });

    it('should keep existing max when new set is lower', () => {
      const current: ExerciseStats = {
        exerciseId: 'ex-1',
        maxWeight: 120,
        maxVolume: 1200,
        maxReps: 15,
        estimated1RM: 150,
        totalSets: 10,
        totalReps: 80,
        totalVolume: 8000,
        lastPerformed: new Date('2026-01-14'),
        updatedAt: new Date('2026-01-14'),
      };

      const result = computeUpdatedExerciseStats(current, 'ex-1', baseSet);

      expect(result.maxWeight).toBe(120); // Kept existing
      expect(result.maxVolume).toBe(1200); // Kept existing
      expect(result.maxReps).toBe(15); // Kept existing
    });
  });

  // --- detectBrokenRecords ---

  describe('detectBrokenRecords', () => {
    const set: WorkoutSet = {
      id: 'set-1',
      exerciseId: 'ex-1',
      setNumber: 1,
      weight: 100,
      reps: 8,
      rir: null,
      restSeconds: null,
      setType: 'normal',
      durationSeconds: 0,
      completed: true,
      skipped: false,
      createdAt: new Date(),
    };

    it('should detect all records when no previous stats', () => {
      const broken = detectBrokenRecords(null, set);

      expect(broken.length).toBe(4);
      expect(broken.map((r) => r.recordType)).toContain('max_weight');
      expect(broken.map((r) => r.recordType)).toContain('max_volume');
      expect(broken.map((r) => r.recordType)).toContain('max_reps');
      expect(broken.map((r) => r.recordType)).toContain('estimated_1rm');
    });

    it('should detect weight PR when weight exceeds previous max', () => {
      const stats: ExerciseStats = {
        exerciseId: 'ex-1',
        maxWeight: 80,
        maxVolume: 900,
        maxReps: 10,
        estimated1RM: 130,
        totalSets: 10,
        totalReps: 80,
        totalVolume: 8000,
        lastPerformed: null,
        updatedAt: new Date(),
      };

      const broken = detectBrokenRecords(stats, set);
      const weightPR = broken.find((r) => r.recordType === 'max_weight');

      expect(weightPR).toBeDefined();
      expect(weightPR!.value).toBe(100);
    });

    it('should return empty array when no records are broken', () => {
      const stats: ExerciseStats = {
        exerciseId: 'ex-1',
        maxWeight: 150,
        maxVolume: 2000,
        maxReps: 20,
        estimated1RM: 200,
        totalSets: 100,
        totalReps: 800,
        totalVolume: 80000,
        lastPerformed: null,
        updatedAt: new Date(),
      };

      const broken = detectBrokenRecords(stats, set);
      expect(broken).toHaveLength(0);
    });
  });
});
