import React from 'react';
import { render } from '@testing-library/react-native';
import ExerciseDetailScreen from '../features/exercise/screens/ExerciseDetailScreen';

describe('ExerciseDetailScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<ExerciseDetailScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
