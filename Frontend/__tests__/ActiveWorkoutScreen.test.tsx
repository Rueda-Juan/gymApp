import React from 'react';
import { render } from '@testing-library/react-native';
import ActiveWorkoutScreen from '../features/workout/screens/ActiveWorkoutScreen';

jest.mock('../hooks/application/useWorkoutStore', () => ({
  useWorkoutStore: () => ({
    session: { id: '1' },
    currentExercise: { name: 'Press' },
  }),
}));
jest.mock('../hooks/application/useRestTimer', () => ({
  useRestTimer: () => ({ rest: 0 }),
}));
jest.mock('../hooks/application/useOfflineQueue', () => ({
  useOfflineQueue: () => ({ queue: [] }),
}));

describe('ActiveWorkoutScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<ActiveWorkoutScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
  // Puedes agregar más tests para otros estados
});
