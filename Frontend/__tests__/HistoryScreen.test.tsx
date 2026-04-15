import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryScreen from '../app/history/HistoryScreen';

describe('HistoryScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<HistoryScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
