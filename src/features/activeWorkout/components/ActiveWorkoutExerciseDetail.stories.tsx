import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ActiveWorkoutExerciseDetail } from './ActiveWorkoutExerciseDetail';

const meta: Meta<typeof ActiveWorkoutExerciseDetail> = {
  title: 'Widgets/ActiveWorkout/ActiveWorkoutExerciseDetail',
  component: ActiveWorkoutExerciseDetail,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ActiveWorkoutExerciseDetail>;

export const Default: Story = {
  args: {
    exercise: {
      id: 'e1',
      exerciseId: 'ex1',
      name: 'Bench Press',
      sets: [
        { id: 's1', type: 'normal', reps: 10, weight: 60, isCompleted: false },
        { id: 's2', type: 'normal', reps: 8, weight: 65, isCompleted: false },
      ]
    },
    focusedSetId: null,
    suggestedWeight: null,
    suggestionMessage: null,
    onSkipExercise: (id) => console.log('skip', id),
    onOpenOptions: (id) => console.log('options', id),
    onUpdateSetValues: (eid, sid, val) => console.log('update', eid, sid, val),
    onToggleSet: (eid, sid, comp) => console.log('toggle', eid, sid, comp),
    onRemoveSet: (eid, sid) => console.log('remove', eid, sid),
    onAddSet: (eid) => console.log('add', eid),
    resolvePreviousWeight: () => 0,
  },
};

