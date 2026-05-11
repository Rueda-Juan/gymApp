import { useCallback, useMemo } from 'react';
import { useStatsDb } from '../db/useStatsDb';
import type { RecordType } from '@kernel';

export function usePersonalRecords() {
  const { getPersonalRecords, getBestPersonalRecord, getPRCountSince } = useStatsDb();

  const getRecords = useCallback(
    (exerciseId: string) => getPersonalRecords(exerciseId),
    [getPersonalRecords]
  );

  const getBestRecord = useCallback(
    (exerciseId: string, recordType: RecordType) => getBestPersonalRecord(exerciseId, recordType),
    [getBestPersonalRecord]
  );

  const countSince = useCallback(
    (since: string) => getPRCountSince(since),
    [getPRCountSince]
  );

  return useMemo(() => ({ getRecords, getBestRecord, countSince }), [getRecords, getBestRecord, countSince]);
}
