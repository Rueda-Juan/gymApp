import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { YStack } from 'tamagui';
import { RoutineCard } from './RoutineCard';
import { RoutineWithLastPerformed } from '..';

const meta: Meta<typeof RoutineCard> = {
  title: 'entities/routine/RoutineCard',
  component: RoutineCard,
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

const mockRoutine: RoutineWithLastPerformed = {
  id: '1',
  name: 'Full Body A',
  notes: 'Focus on progressive overload',
  exercises: [
    { 
      id: 're1', 
      routineId: '1', 
      exerciseId: 'ex1', 
      orderIndex: 1, 
      targetSets: 3, 
      targetReps: 10,
      supersetGroup: null,
      exercise: {
        id: 'ex1',
        name: 'Squat',
        nameEs: null,
        primaryMuscle: 'Legs',
        primaryMuscles: ['quads', 'glutes'],
        secondaryMuscles: ['hamstrings'],
        equipment: 'Barbell',
        weightIncrement: 2.5,
        description: null,
        animationPath: null,
        isCustom: false,
        createdBy: null,
        type: 'compound',
        loadType: 'weighted',
        isArchived: false,
        exerciseKey: null,
        anatomicalSvg: null,
      }
    },
    { 
      id: 're2', 
      routineId: '1', 
      exerciseId: 'ex2', 
      orderIndex: 2, 
      targetSets: 3, 
      targetReps: 10,
      supersetGroup: null,
      exercise: {
        id: 'ex2',
        name: 'Bench Press',
        nameEs: null,
        primaryMuscle: 'Chest',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['triceps', 'front-delts'],
        equipment: 'Barbell',
        weightIncrement: 2.5,
        description: null,
        animationPath: null,
        isCustom: false,
        createdBy: null,
        type: 'compound',
        loadType: 'weighted',
        isArchived: false,
        exerciseKey: null,
        anatomicalSvg: null,
      }
    },
  ],
  muscles: ['chest', 'back', 'legs'],
  lastPerformed: 'Hace 2 días',
  createdAt: new Date().toISOString(),
};

export const Default: Story = {
  args: {
    routine: mockRoutine,
    index: 0,
    onOpen: () => console.log('Open routine'),
    onStart: () => console.log('Start routine'),
  },
};

