import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { YStack } from 'tamagui';
import { StrengthProgressCard } from './StrengthProgressCard';

const meta: Meta<typeof StrengthProgressCard> = {
  title: 'entities/stats/StrengthProgressCard',
  component: StrengthProgressCard,
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
    strengthExercise: { name: 'Bench Press', nameEs: 'Press de Banca' },
    strengthHistory: [{ x: '2023-01-01', y: 100 }],
    current1RM: 100,
    onOpenExercisePicker: () => console.log('Open picker'),
  },
};

