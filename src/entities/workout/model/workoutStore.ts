import { useState } from 'react';

export function useWorkoutStore() {
  const [session, setSession] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  // Add actions and logic as needed
  return { session, setSession, currentExercise, setCurrentExercise };
}

