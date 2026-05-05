import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { MiniPlayer } from './MiniPlayer';

const meta: Meta<typeof MiniPlayer> = {
  title: 'Widgets/MiniPlayer/MiniPlayer',
  component: MiniPlayer,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'flex-end', paddingBottom: 40 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MiniPlayer>;

export const Default: Story = {
  args: {},
};

