import React from 'react';
import { render } from '@testing-library/react-native';
import SummaryScreen from '../app/summary/SummaryScreen';

describe('SummaryScreen', () => {
  it('renderiza loading correctamente', () => {
    const { getByText } = render(<SummaryScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
