import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { HomeCTA } from './HomeCTA';

const meta: Meta<typeof HomeCTA> = {
  title: 'Widgets/HomeCTA',
  component: HomeCTA,
  args: {
    isActive: false,
    routineName: 'Empuje A',
    onContinue: () => console.log('Continue'),
    onNewSession: () => console.log('New Session'),
    onFreeSession: () => console.log('Free Session'),
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HomeCTA>;

export const Idle: Story = {
  args: {
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    routineName: 'Empuje A',
  },
};

export const ActiveLongName: Story = {
  args: {
    isActive: true,
    routineName: 'Rutina de Fuerza Máxima en Piernas y Glúteos',
  },
};

