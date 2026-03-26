import { useDI } from '../context/DIContext';

export function useStats() {
  const { statsService } = useDI();
  return statsService;
}
