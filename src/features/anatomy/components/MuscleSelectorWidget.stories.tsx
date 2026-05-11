import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MuscleSelectorWidget } from './muscleSelectorWidget';

const meta: Meta<typeof MuscleSelectorWidget> = {
  title: 'Widgets/Anatomy/MuscleSelectorWidget',
  component: MuscleSelectorWidget,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MuscleSelectorWidget>;

export const Default: Story = {
  args: {},
};

