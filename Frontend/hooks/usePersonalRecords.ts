import { useDI } from '../context/DIContext';

export function usePersonalRecords() {
  const { personalRecordService } = useDI();
  return personalRecordService;
}
