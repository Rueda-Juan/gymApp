export const getExerciseName = (
  exercise: { name: string; nameEs?: string | null },
  locale: 'es' | 'en' = 'es'
): string => {
  if (!exercise) return '';
  if (locale === 'en') return exercise.name;
  return exercise.nameEs ?? exercise.name;
};
