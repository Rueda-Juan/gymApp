import { useState, useCallback } from 'react';
import { HIERARCHICAL_MUSCLES } from '@/constants/exercise';
import type { MuscleGroup } from 'backend/shared/types';

export function useMuscleSelection(initialPrimary: MuscleGroup[], initialSecondary: MuscleGroup[]) {
  const [muscleRole, setMuscleRole] = useState<'primary' | 'secondary'>('primary');
  const [pendingPrimary, setPendingPrimary] = useState<MuscleGroup[]>(initialPrimary);
  const [pendingSecondary, setPendingSecondary] = useState<MuscleGroup[]>(initialSecondary);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [muscleError, setMuscleError] = useState<string | null>(null);

  const handleToggleMuscle = useCallback((muscle: MuscleGroup) => {
    const group = HIERARCHICAL_MUSCLES.find(hm => hm.category === muscle);
    const parent = HIERARCHICAL_MUSCLES.find(hm => hm.subdivisions?.includes(muscle));
    if (muscleRole === 'primary') {
      setPendingSecondary((prev) => {
        let next = prev.filter((m) => m !== muscle);
        if (group?.subdivisions) {
          next = next.filter((m) => !group.subdivisions!.includes(m as any));
        }
        if (parent) {
          next = next.filter((m) => m !== parent.category);
        }
        return next;
      });
      setPendingPrimary((prev) => {
        let next = prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle];
        if (group?.subdivisions) {
          next = next.filter((m) => !group.subdivisions!.includes(m as any));
        }
        if (parent) {
          next = next.filter((m) => m !== parent.category);
        }
        return next;
      });
    } else {
      setPendingPrimary((prev) => {
        let next = prev.filter((m) => m !== muscle);
        if (group?.subdivisions) {
          next = next.filter((m) => !group.subdivisions!.includes(m as any));
        }
        if (parent) {
          next = next.filter((m) => m !== parent.category);
        }
        return next;
      });
      setPendingSecondary((prev) => {
        let next = prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle];
        if (group?.subdivisions) {
          next = next.filter((m) => !group.subdivisions!.includes(m as any));
        }
        if (parent) {
          next = next.filter((m) => m !== parent.category);
        }
        return next;
      });
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

export default useMuscleSelection;
