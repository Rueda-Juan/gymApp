import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ActiveWorkoutBottomBar } from './ActiveWorkoutBottomBar';
import { AnimatedStyle } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

const meta: Meta<typeof ActiveWorkoutBottomBar> = {
  title: 'Widgets/ActiveWorkout/ActiveWorkoutBottomBar',
  component: ActiveWorkoutBottomBar,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ActiveWorkoutBottomBar>;

export const Default: Story = {
  args: {
    isFirst: false,
    isLast: false,
    isFinishing: false,
    sessionNote: undefined,
    restTimerIsActive: false,
    restDisplaySeconds: 60,
    insetsBottom: 20,
    hourglassAnimatedStyle: {} as AnimatedStyle<ViewStyle>,
    onPrev: () => console.log('prev'),
    onOpenNote: () => console.log('open note'),
    onOpenRestTimer: () => console.log('open rest timer'),
    onNext: () => console.log('next'),
    onFinish: () => console.log('finish'),
    onOpenPlateCalculator: () => console.log('open plate calculator'),
  },
};

