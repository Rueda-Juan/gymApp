import { useDI } from '../context/DIContext';

export function useWorkout() {
  const { workoutService } = useDI();
  return workoutService;
}
