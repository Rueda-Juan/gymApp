/**
 * SetType — categorizes the purpose and intensity of a workout set.
 * - normal: standard working set
 * - warmup: lighter weight, not part of working volume
 * - dropset: performed immediately after a set with lower weight
 * - failure: taken to absolute muscular failure (RIR 0)
 */
export const SET_TYPES = ['normal', 'warmup', 'dropset', 'failure'] as const;

export type SetType = typeof SET_TYPES[number];
