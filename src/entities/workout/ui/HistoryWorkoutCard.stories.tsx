import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { YStack } from 'tamagui';
import { HistoryWorkoutCard } from './HistoryWorkoutCard';

const meta: Meta<typeof HistoryWorkoutCard> = {
  title: 'entities/workout/HistoryWorkoutCard',
  component: HistoryWorkoutCard,
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
    item: {
      id: '1',
      date: new Date().toISOString(),
      durationSeconds: 3600,
      exercises: [
        { id: '1', name: 'Bench Press', sets: [{ weight: 100, reps: 5 }] },
        { id: '2', name: 'Squat', sets: [{ weight: 120, reps: 5 }] },
      ]
    },
    index: 0,
    onDelete: (id: string) => console.log('Delete', id),
  },
};

