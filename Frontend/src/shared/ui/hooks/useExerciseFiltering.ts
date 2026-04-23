import { useMemo } from 'react';
import type { Exercise } from '@kernel';

export function useExerciseFiltering(exercises: Exercise[], searchQuery: string, selectedMuscle: string) {
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const query = searchQuery.toLowerCase().trim();
      
      const matchesSearch = !query || 
        exercise.name.toLowerCase().includes(query);
      
      const matchesMuscle = !selectedMuscle || 
        exercise.primaryMuscles?.includes(selectedMuscle as any) ||
        exercise.secondaryMuscles?.includes(selectedMuscle as any);
      
      return matchesSearch && matchesMuscle;
    });
  }, [exercises, searchQuery, selectedMuscle]);

  return { filteredExercises };
}
