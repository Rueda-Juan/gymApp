import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { YStack } from 'tamagui';
import { LastWorkoutCard } from './LastWorkoutCard';

const meta: Meta<typeof LastWorkoutCard> = {
  title: 'widgets/home/LastWorkoutCard',
  component: LastWorkoutCard,
  decorators: [
    (Story) => (
      <YStack padding="$4" gap="$4" flex={1} backgroundColor="$background">
        <Story />
      </YStack>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lastWorkout: {
      id: '1',
      date: new Date().toISOString(),
      durationSeconds: 4000,
      workoutExercises: [],
      routineId: null,
      notes: null,
    },
    onViewAll: () => console.log('View all'),
    onViewLast: () => console.log('View last'),
  },
};

