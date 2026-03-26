import { useDI } from '../context/DIContext';

export function useBodyWeight() {
  const { bodyWeightService } = useDI();
  return bodyWeightService;
}
