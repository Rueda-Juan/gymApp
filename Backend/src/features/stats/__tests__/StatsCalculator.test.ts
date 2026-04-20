import {
  calculateEstimated1RM,
  calculateSetVolume,
  computeUpdatedExerciseStats,
  detectBrokenRecords,
} from '../utils/stats-calculator';
import type { WorkoutSet } from '../../workouts/workout-set.entity';
import type { ExerciseStats } from '../exercise-stats.entity';

function createSet(overrides: Partial<WorkoutSet> = {}): WorkoutSet {
  return {
    id: 'set-1',
    exerciseId: 'ex-1',
    setNumber: 1,
    weight: 100,
    reps: 8,
    partialReps: null,
    rir: null,
    restSeconds: null,
    setType: 'normal',
    durationSeconds: 0,
    completed: true,
    skipped: false,
    createdAt: new Date('2026-01-15T10:00:00Z'),
    ...overrides,
  };
}

function createStats(overrides: Partial<ExerciseStats> = {}): ExerciseStats {
  return {
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
    ...overrides,
  };
}

describe('StatsCalculator', () => {

  // ═══════════════════════════════════════════════════════════════
  // calculateEstimated1RM
  // ═══════════════════════════════════════════════════════════════

  describe('calculateEstimated1RM', () => {

    describe('happy path', () => {
      it('calcula Epley correctamente: 100kg × 8 reps = ~126.67', () => {
        expect(calculateEstimated1RM(100, 8)).toBeCloseTo(126.67, 1);
      });

      it('calcula Epley correctamente: 60kg × 12 reps = 84', () => {
        expect(calculateEstimated1RM(60, 12)).toBe(84);
      });

      it('1 rep retorna el peso directamente (sin multiplicador)', () => {
        // Previene: fórmula Epley aplicada a 1RM real → resultado inflado
        expect(calculateEstimated1RM(100, 1)).toBe(100);
      });
    });

    describe('boundary values', () => {
      it('retorna 0 cuando peso es 0', () => {
        expect(calculateEstimated1RM(0, 10)).toBe(0);
      });

      it('retorna 0 cuando reps es 0', () => {
        expect(calculateEstimated1RM(100, 0)).toBe(0);
      });

      it('peso muy alto (500kg) calcula sin overflow', () => {
        // Previene: overflow numérico con pesos extremos
        const result = calculateEstimated1RM(500, 5);
        expect(result).toBeGreaterThan(500);
        expect(Number.isFinite(result)).toBe(true);
      });

      it('reps muy altas (100) calcula sin overflow', () => {
        const result = calculateEstimated1RM(100, 100);
        expect(Number.isFinite(result)).toBe(true);
      });

      it('2 reps aplica fórmula Epley (no la excepción de 1 rep)', () => {
        // 100 * (1 + 2/30) = 100 * 1.0667 = 106.67
        expect(calculateEstimated1RM(100, 2)).toBeCloseTo(106.67, 1);
      });
    });

    describe('valores negativos', () => {
      it('retorna 0 con peso negativo', () => {
        expect(calculateEstimated1RM(-10, 5)).toBe(0);
      });

      it('retorna 0 con reps negativas', () => {
        expect(calculateEstimated1RM(100, -5)).toBe(0);
      });
    });

    describe('valores decimales', () => {
      it('acepta peso decimal (37.5kg)', () => {
        const result = calculateEstimated1RM(37.5, 10);
        expect(result).toBeGreaterThan(37.5);
        expect(Number.isFinite(result)).toBe(true);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // calculateSetVolume
  // ═══════════════════════════════════════════════════════════════

  describe('calculateSetVolume', () => {
    it('peso × reps', () => {
      expect(calculateSetVolume(100, 8)).toBe(800);
    });

    it('retorna 0 cuando peso es 0', () => {
      expect(calculateSetVolume(0, 10)).toBe(0);
    });

    it('retorna 0 cuando reps es 0', () => {
      expect(calculateSetVolume(100, 0)).toBe(0);
    });

    it('maneja decimales (37.5 × 10 = 375)', () => {
      expect(calculateSetVolume(37.5, 10)).toBe(375);
    });

    it('ambos cero retorna 0', () => {
      expect(calculateSetVolume(0, 0)).toBe(0);
    });

    it('valores negativos producen volumen negativo (sin protección)', () => {
      // Documenta comportamiento actual: la función no valida signo
      const result = calculateSetVolume(-10, 5);
      expect(result).toBe(-50);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // computeUpdatedExerciseStats
  // ═══════════════════════════════════════════════════════════════

  describe('computeUpdatedExerciseStats', () => {

    describe('sin stats previas (current = null)', () => {
      it('crea stats nuevos con los valores del set', () => {
        const set = createSet({ weight: 100, reps: 8 });
        const result = computeUpdatedExerciseStats(null, 'ex-1', set);

        expect(result.exerciseId).toBe('ex-1');
        expect(result.maxWeight).toBe(100);
        expect(result.maxVolume).toBe(800);
        expect(result.maxReps).toBe(8);
        expect(result.totalSets).toBe(1);
        expect(result.totalReps).toBe(8);
        expect(result.totalVolume).toBe(800);
      });

      it('calcula estimated1RM para stats nuevos', () => {
        const set = createSet({ weight: 100, reps: 8 });
        const result = computeUpdatedExerciseStats(null, 'ex-1', set);

        expect(result.estimated1RM).toBeCloseTo(126.67, 1);
      });

      it('asigna lastPerformed con la fecha del set', () => {
        // Previene: lastPerformed null en stats recién creados
        const setDate = new Date('2026-03-15T10:00:00Z');
        const set = createSet({ createdAt: setDate });
        const result = computeUpdatedExerciseStats(null, 'ex-1', set);

        expect(result.lastPerformed).toEqual(setDate);
      });
    });

    describe('con stats previas', () => {
      it('acumula totals correctamente', () => {
        const current = createStats({
          totalSets: 5,
          totalReps: 40,
          totalVolume: 3200,
        });
        const set = createSet({ weight: 100, reps: 8 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.totalSets).toBe(6);
        expect(result.totalReps).toBe(48);
        expect(result.totalVolume).toBe(4000);
      });

      it('actualiza maxWeight cuando el set supera el previo', () => {
        const current = createStats({ maxWeight: 80 });
        const set = createSet({ weight: 100 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxWeight).toBe(100);
      });

      it('mantiene maxWeight cuando el set es menor', () => {
        const current = createStats({ maxWeight: 120 });
        const set = createSet({ weight: 100 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxWeight).toBe(120);
      });

      it('actualiza maxVolume cuando el set supera el previo', () => {
        const current = createStats({ maxVolume: 640 });
        const set = createSet({ weight: 100, reps: 8 }); // vol = 800

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxVolume).toBe(800);
      });

      it('mantiene maxVolume cuando el set es menor', () => {
        const current = createStats({ maxVolume: 1200 });
        const set = createSet({ weight: 100, reps: 8 }); // vol = 800

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxVolume).toBe(1200);
      });

      it('actualiza maxReps cuando el set supera el previo', () => {
        const current = createStats({ maxReps: 5 });
        const set = createSet({ reps: 8 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxReps).toBe(8);
      });

      it('mantiene maxReps cuando el set es menor', () => {
        const current = createStats({ maxReps: 15 });
        const set = createSet({ reps: 8 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxReps).toBe(15);
      });

      it('actualiza estimated1RM cuando el set la supera', () => {
        const current = createStats({ estimated1RM: 100 });
        const set = createSet({ weight: 100, reps: 8 }); // 1RM ≈ 126.67

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.estimated1RM).toBeGreaterThan(100);
      });

      it('mantiene estimated1RM cuando el set es menor', () => {
        const current = createStats({ estimated1RM: 200 });
        const set = createSet({ weight: 50, reps: 8 }); // 1RM ≈ 63.33

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.estimated1RM).toBe(200);
      });

      it('updatedAt se actualiza con cada set', () => {
        const oldDate = new Date('2020-01-01');
        const current = createStats({ updatedAt: oldDate });
        const set = createSet();

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.updatedAt.getTime()).toBeGreaterThan(oldDate.getTime());
      });
    });

    describe('edge cases', () => {
      it('set con weight=0 y reps=0 acumula sin romper', () => {
        // Previene: set vacío (bodyweight, cancelado) rompe cálculos
        const current = createStats({ totalSets: 5, totalReps: 40, totalVolume: 3200 });
        const set = createSet({ weight: 0, reps: 0 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.totalSets).toBe(6);
        expect(result.totalReps).toBe(40);
        expect(result.totalVolume).toBe(3200);
      });

      it('set igual que current maxes no cambia máximos', () => {
        // Previene: igualar (no superar) un PR lo registra como nuevo max
        const current = createStats({ maxWeight: 100, maxReps: 8, maxVolume: 800 });
        const set = createSet({ weight: 100, reps: 8 });

        const result = computeUpdatedExerciseStats(current, 'ex-1', set);

        expect(result.maxWeight).toBe(100);
        expect(result.maxReps).toBe(8);
        expect(result.maxVolume).toBe(800);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // detectBrokenRecords
  // ═══════════════════════════════════════════════════════════════

  describe('detectBrokenRecords', () => {

    describe('sin stats previas (primer set del ejercicio)', () => {
      it('detecta los 4 tipos de PR', () => {
        const set = createSet({ weight: 100, reps: 8 });
        const broken = detectBrokenRecords(null, set);

        expect(broken).toHaveLength(4);
        const types = broken.map(r => r.recordType);
        expect(types).toContain('max_weight');
        expect(types).toContain('max_volume');
        expect(types).toContain('max_reps');
        expect(types).toContain('estimated_1rm');
      });

      it('los valores de los PRs son correctos', () => {
        const set = createSet({ weight: 100, reps: 8 });
        const broken = detectBrokenRecords(null, set);

        const weightPR = broken.find(r => r.recordType === 'max_weight');
        const repsPR = broken.find(r => r.recordType === 'max_reps');
        const volumePR = broken.find(r => r.recordType === 'max_volume');

        expect(weightPR!.value).toBe(100);
        expect(repsPR!.value).toBe(8);
        expect(volumePR!.value).toBe(800);
      });
    });

    describe('PRs individuales', () => {
      it('detecta solo peso PR cuando solo peso supera', () => {
        const stats = createStats({
          maxWeight: 80,
          maxVolume: 900,
          maxReps: 10,
          estimated1RM: 130,
        });
        const set = createSet({ weight: 100, reps: 8 }); // vol=800 < 900, reps=8 < 10

        const broken = detectBrokenRecords(stats, set);

        const types = broken.map(r => r.recordType);
        expect(types).toContain('max_weight');
        expect(types).not.toContain('max_volume');
        expect(types).not.toContain('max_reps');
      });

      it('detecta solo reps PR cuando solo reps supera', () => {
        const stats = createStats({
          maxWeight: 150,
          maxVolume: 2000,
          maxReps: 5,
          estimated1RM: 200,
        });
        const set = createSet({ weight: 50, reps: 8 }); // vol=400, weight=50

        const broken = detectBrokenRecords(stats, set);

        const types = broken.map(r => r.recordType);
        expect(types).toContain('max_reps');
        expect(types).not.toContain('max_weight');
        expect(types).not.toContain('max_volume');
      });

      it('detecta solo volumen PR', () => {
        const stats = createStats({
          maxWeight: 120,
          maxVolume: 700,
          maxReps: 15,
          estimated1RM: 200,
        });
        const set = createSet({ weight: 100, reps: 8 }); // vol=800 > 700

        const broken = detectBrokenRecords(stats, set);

        const types = broken.map(r => r.recordType);
        expect(types).toContain('max_volume');
        expect(types).not.toContain('max_weight');
        expect(types).not.toContain('max_reps');
      });
    });

    describe('sin PRs', () => {
      it('retorna array vacío cuando ningún record se rompe', () => {
        const stats = createStats({
          maxWeight: 150,
          maxVolume: 2000,
          maxReps: 20,
          estimated1RM: 200,
        });
        const set = createSet({ weight: 100, reps: 8 });

        const broken = detectBrokenRecords(stats, set);

        expect(broken).toHaveLength(0);
      });

      it('igualar records existentes no detecta PR (strictly greater)', () => {
        // Previene: PR duplicados cada vez que se iguala un máximo
        const stats = createStats({
          maxWeight: 100,
          maxReps: 8,
          maxVolume: 800,
          estimated1RM: 126.67,
        });
        const set = createSet({ weight: 100, reps: 8 });

        const broken = detectBrokenRecords(stats, set);

        expect(broken).toHaveLength(0);
      });
    });

    describe('edge cases', () => {
      it('set con weight=0 y reps=0 no detecta PRs contra stats existentes', () => {
        // Previene: set vacío genera PRs fantasma
        const stats = createStats({
          maxWeight: 100,
          maxReps: 8,
          maxVolume: 800,
          estimated1RM: 126.67,
        });
        const set = createSet({ weight: 0, reps: 0 });

        const broken = detectBrokenRecords(stats, set);

        expect(broken).toHaveLength(0);
      });

      it('múltiples PRs simultáneos (peso + reps + volumen + 1RM)', () => {
        const stats = createStats({
          maxWeight: 50,
          maxVolume: 200,
          maxReps: 3,
          estimated1RM: 55,
        });
        const set = createSet({ weight: 100, reps: 8 }); // supera todo

        const broken = detectBrokenRecords(stats, set);

        expect(broken).toHaveLength(4);
      });
    });
  });
});
