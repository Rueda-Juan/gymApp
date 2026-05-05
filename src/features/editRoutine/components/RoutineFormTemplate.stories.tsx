import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { RoutineFormTemplate } from './RoutineFormTemplate';

const meta: Meta<typeof RoutineFormTemplate> = {
  title: 'Widgets/RoutineEditor/RoutineFormTemplate',
  component: RoutineFormTemplate,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RoutineFormTemplate>;

export const Default: Story = {
  args: {
    title: 'Nueva Rutina',
    isSaving: false,
    onSave: () => console.log('save'),
  },
};

