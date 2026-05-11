import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { YStack } from 'tamagui';
import { BodyWeightCard } from './BodyWeightCard';

const meta: Meta<typeof BodyWeightCard> = {
  title: 'entities/stats/BodyWeightCard',
  component: BodyWeightCard,
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
    weightHistory: [{ id: '1', date: new Date().toISOString(), weight: 75.5, notes: null }],
    onAddWeight: () => console.log('Press add weight'),
  },
};

