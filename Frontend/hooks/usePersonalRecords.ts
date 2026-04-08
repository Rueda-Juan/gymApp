import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';
import type { RecordType } from 'backend/shared/types';

export function usePersonalRecords() {
  const { getPersonalRecords, getBestPersonalRecord, getPRCountSince } = useDI();

  const getRecords = useCallback(
    (exerciseId: string) => getPersonalRecords.execute(exerciseId),
    [getPersonalRecords]
  );

  const getBestRecord = useCallback(
    (exerciseId: string, recordType: RecordType) => getBestPersonalRecord.execute(exerciseId, recordType),
    [getBestPersonalRecord]
  );

  const countSince = useCallback(
    (since: string) => getPRCountSince.execute(since),
    [getPRCountSince]
  );

  return useMemo(() => ({ getRecords, getBestRecord, countSince }), [getRecords, getBestRecord, countSince]);
}
