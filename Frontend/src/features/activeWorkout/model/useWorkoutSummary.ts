import { create } from 'zustand';
import type { RecordType } from '@kernel';

interface WorkoutSummaryRecord {
  exerciseId: string;
  recordType: RecordType;
  value: number;
}

interface WorkoutSummaryState {
  newRecords: WorkoutSummaryRecord[];
  setNewRecords: (records: WorkoutSummaryRecord[]) => void;
  clearNewRecords: () => void;
}

export const useWorkoutSummary = create<WorkoutSummaryState>((set) => ({
  newRecords: [],
  setNewRecords: (records) => set({ newRecords: records }),
  clearNewRecords: () => set({ newRecords: [] }),
}));
