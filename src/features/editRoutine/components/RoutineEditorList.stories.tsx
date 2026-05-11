import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { RoutineEditorList } from './RoutineEditorList';

const meta: Meta<typeof RoutineEditorList> = {
  title: 'Widgets/RoutineEditor/RoutineEditorList',
  component: RoutineEditorList,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RoutineEditorList>;

export const Default: Story = {
  args: {
    exercises: [],
    onReorder: () => console.log('reorder'),
    onRemove: () => console.log('remove'),
    onUpdate: () => console.log('update'),
    onLinkNext: () => console.log('link next'),
    onUnlink: () => console.log('unlink'),
  },
};

