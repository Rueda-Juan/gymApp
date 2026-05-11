import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ActiveWorkoutController } from './ActiveWorkoutController';

const meta: Meta<typeof ActiveWorkoutController> = {
  title: 'Widgets/ActiveWorkout/ActiveWorkoutController',
  component: ActiveWorkoutController,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ActiveWorkoutController>;

export const Default: Story = {
  args: {},
};

