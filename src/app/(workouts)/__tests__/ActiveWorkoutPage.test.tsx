import React from 'react';
import { render } from '@testing-library/react-native';
import ActiveWorkoutPage from '../[workoutId]';

// Mocks
jest.mock('@/features/activeWorkout', () => {
  const { View, Text } = require('react-native');
  return {
    ActiveWorkoutController: () => <View><Text>ActiveWorkoutController Mock</Text></View>,
  };
});

jest.mock('@/shared/ui', () => {
  const { View } = require('react-native');
  return {
    Screen: ({ children }: any) => <View>{children}</View>,
  };
});

describe('ActiveWorkoutPage', () => {
  it('renderiza el ActiveWorkoutController dentro de un Screen', () => {
    const { getByText } = render(<ActiveWorkoutPage />);
    expect(getByText('ActiveWorkoutController Mock')).toBeTruthy();
  });
});
