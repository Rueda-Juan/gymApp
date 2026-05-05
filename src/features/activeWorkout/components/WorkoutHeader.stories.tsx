import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { WorkoutHeader } from './WorkoutHeader';

const meta: Meta<typeof WorkoutHeader> = {
  title: 'Widgets/ActiveWorkout/WorkoutHeader',
  component: WorkoutHeader,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', paddingTop: 40 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkoutHeader>;

export const Default: Story = {
  args: {
    formattedTime: '01:23',
    routineName: 'Push Day',
    currentExerciseIndex: 1,
    totalExercises: 5,
    isFocusMode: false,
    onCancel: () => console.log('cancel'),
  },
};

