import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { HomeHeader } from './HomeHeader';

const meta: Meta<typeof HomeHeader> = {
  title: 'Widgets/Home/HomeHeader',
  component: HomeHeader,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HomeHeader>;

export const Default: Story = {
  args: {
    userName: 'Juanchi',
    onEditProfile: () => console.log('Edit profile'),
  },
};

