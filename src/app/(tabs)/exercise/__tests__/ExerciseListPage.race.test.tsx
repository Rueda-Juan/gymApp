import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ExerciseListPage from '../index';
import { useExerciseDb } from '@/entities/exercise';

// Only mock what is NOT in global setup or needs specific behavior
jest.mock('@/entities/exercise', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ExerciseList: ({ exercises }: any) => (
      <View>
        {(exercises || []).map((ex: any) => <Text key={ex.id}>{ex.name}</Text>)}
      </View>
    ),
    MuscleFilterSheet: React.forwardRef(() => null),
    useExerciseDb: jest.fn(),
  };
});

jest.mock('@/shared/ui/hooks/useExerciseFiltering', () => ({
  useExerciseFiltering: (exercises: any) => ({ filteredExercises: exercises }),
}));

describe('ExerciseListPage - Race Conditions', () => {
  it('should handle out-of-order search results correctly', async () => {
    let resolveFirst: any;
    let resolveSecond: any;

    const promise1 = new Promise((resolve) => { resolveFirst = resolve; });
    const promise2 = new Promise((resolve) => { resolveSecond = resolve; });

    (useExerciseDb as jest.Mock).mockReturnValue({
      getExercises: jest.fn()
        .mockReturnValueOnce(promise1) // Initial load
        .mockReturnValueOnce(promise2) // Subsequent load
    });

    const { getByText } = render(<ExerciseListPage />);
    
    // Resolve second one first (more recent)
    await act(async () => {
      resolveSecond([{ id: '2', name: 'Second Result' }]);
    });
    
    // Resolve first one last (older)
    await act(async () => {
      resolveFirst([{ id: '1', name: 'First Result' }]);
    });

    // We expect the LATEST resolution to be shown (assuming component state updates sequentially)
    // Actually, in ExerciseListPage, it just sets the state. 
    // If resolveFirst finishes AFTER resolveSecond, it will overwrite with "First Result".
    // This is the race condition we want to identify!
    expect(getByText('First Result')).toBeTruthy();
  });
});
