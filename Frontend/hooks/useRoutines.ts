import { useDI } from '../context/DIContext';

export function useRoutines() {
  const { routineService } = useDI();
  return routineService;
}
