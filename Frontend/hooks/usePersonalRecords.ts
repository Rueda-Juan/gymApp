import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';
import type { RecordType } from 'backend/shared/types';

export function usePersonalRecords() {
  const { personalRecordService } = useDI();

  const getRecords = useCallback(
    (exerciseId: string) => personalRecordService.getRecords(exerciseId),
    [personalRecordService]
  );

  const getBestRecord = useCallback(
    (exerciseId: string, recordType: RecordType) => personalRecordService.getBestRecord(exerciseId, recordType),
    [personalRecordService]
  );

  const countSince = useCallback(
    (since: string) => personalRecordService.countSince(since),
    [personalRecordService]
  );

  return useMemo(() => ({ getRecords, getBestRecord, countSince }), [getRecords, getBestRecord, countSince]);
}
