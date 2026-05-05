import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { WorkoutExerciseSummaryList } from './WorkoutExerciseSummaryList';

const meta: Meta<typeof WorkoutExerciseSummaryList> = {
  title: 'Widgets/ActiveWorkout/WorkoutExerciseSummaryList',
  component: WorkoutExerciseSummaryList,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkoutExerciseSummaryList>;

export const Default: Story = {
  args: {
    exercises: [
      { 
        id: '1',
        exerciseId: 'ex1', 
        name: 'Bench Press', 
        sets: [
          { id: 's1', weight: 60, reps: 10, isCompleted: true },
          { id: 's2', weight: 60, reps: 10, isCompleted: true },
        ],
        supersetGroup: null 
      }
    ],
    newRecords: [],
  },
};

