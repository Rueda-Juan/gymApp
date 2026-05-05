import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { WeightInputModal } from './WeightInputModal';

const meta: Meta<typeof WeightInputModal> = {
  title: 'Shared/Modals/WeightInputModal',
  component: WeightInputModal,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WeightInputModal>;

export const Default: Story = {
  args: {
    type: 'barbell',
    value: 60,
    onChange: (val: number) => console.log(val),
    onClose: () => console.log('close'),
  },
};

