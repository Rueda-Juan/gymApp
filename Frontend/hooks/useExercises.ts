import { useDI } from '../context/DIContext';

export function useExercises() {
  const { exerciseService } = useDI();
  return exerciseService;
}
