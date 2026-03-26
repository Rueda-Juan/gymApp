import type { MuscleGroup } from './MuscleGroup';

/**
 * Muscle activation levels during a workout session.
 * - hot:  Worked as primary muscle → no warmup needed
 * - warm: Worked as secondary/synergist (~50% activation) → abbreviated warmup
 * - cold: Not yet worked → full warmup protocol
 */
export type ActivationLevel = 'hot' | 'warm' | 'cold';

/**
 * SessionContext tracks the activation state of each muscle group
 * throughout a workout session. It enables intelligent warmup
 * recommendations based on what muscles have already been worked.
 */
export class SessionContext {
  private readonly activationMap = new Map<MuscleGroup, ActivationLevel>();

  /**
   * Mark muscles as "hot" (fully activated — worked as primary).
   * Always overrides any previous state.
   */
  markAsPrimary(muscles: MuscleGroup[]): void {
    for (const m of muscles) {
      this.activationMap.set(m, 'hot');
    }
  }

  /**
   * Mark muscles as "warm" (partially activated — worked as secondary).
   * Only upgrades from 'cold' → 'warm', never downgrade 'hot' → 'warm'.
   */
  markAsSecondary(muscles: MuscleGroup[]): void {
    for (const m of muscles) {
      if (this.activationMap.get(m) !== 'hot') {
        this.activationMap.set(m, 'warm');
      }
    }
  }

  /** Get the activation level of a specific muscle. Defaults to 'cold'. */
  getState(muscle: MuscleGroup): ActivationLevel {
    return this.activationMap.get(muscle) ?? 'cold';
  }

  /**
   * Get the "worst" (coldest) activation level among a list of muscles.
   * Used to determine warmup protocol for compound exercises.
   * Priority: cold > warm > hot
   */
  getColdestState(muscles: MuscleGroup[]): ActivationLevel {
    let coldest: ActivationLevel = 'hot';
    for (const m of muscles) {
      const state = this.getState(m);
      if (state === 'cold') return 'cold'; // can't get worse
      if (state === 'warm') coldest = 'warm';
    }
    return coldest;
  }

  /** Get all tracked muscle states as a plain record. */
  getAllStates(): Record<string, ActivationLevel> {
    const result: Record<string, ActivationLevel> = {};
    for (const [muscle, level] of this.activationMap) {
      result[muscle] = level;
    }
    return result;
  }

  /** Reset all muscle states to cold (new session). */
  reset(): void {
    this.activationMap.clear();
  }
}
