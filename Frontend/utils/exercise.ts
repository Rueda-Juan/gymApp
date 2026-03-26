export const getExerciseName = (exercise: { name: string; nameEs?: string | null }) => {
  if (!exercise) return '';
  return exercise.nameEs ?? exercise.name;
};
