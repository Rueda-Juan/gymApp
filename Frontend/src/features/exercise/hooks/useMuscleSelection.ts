import { useState, useCallback } from 'react';
import type { MuscleGroup } from '@kernel';

export type MuscleRole = 'primary' | 'secondary';

export function useMuscleSelection(initialPrimary: MuscleGroup[] = [], initialSecondary: MuscleGroup[] = []) {
  const [muscleRole, setMuscleRole] = useState<MuscleRole>('primary');
  const [pendingPrimary, setPendingPrimary] = useState<MuscleGroup[]>(initialPrimary);
  const [pendingSecondary, setPendingSecondary] = useState<MuscleGroup[]>(initialSecondary);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [muscleError, setMuscleError] = useState<string | null>(null);

  const handleToggleMuscle = useCallback((muscle: string) => {
    const m = muscle as MuscleGroup;
    if (muscleRole === 'primary') {
      setPendingPrimary(prev => 
        prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
      );
      // Ensure it's not in secondary
      setPendingSecondary(prev => prev.filter(x => x !== m));
    } else {
      setPendingSecondary(prev => 
        prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
      );
      // Ensure it's not in primary
      setPendingPrimary(prev => prev.filter(x => x !== m));
    }
  }, [muscleRole]);

  return {
    muscleRole,
    setMuscleRole,
    pendingPrimary,
    setPendingPrimary,
    pendingSecondary,
    setPendingSecondary,
    expandedGroup,
    setExpandedGroup,
    muscleError,
    setMuscleError,
    handleToggleMuscle,
  };
}
