import React from 'react';
import { render } from '@testing-library/react-native';
import { BodyAnatomySvg } from '../BodyAnatomySvg';

// Mock Tamagui useTheme
jest.mock('tamagui', () => ({
  ...jest.requireActual('tamagui'),
  useTheme: () => ({
    primary: { val: '#E8762E' },
    primaryDark: { val: '#D4621A' },
    info: { val: '#4F80B8' },
    infoSubtle: { val: 'rgba(79, 128, 184, 0.2)' },
    surfaceSecondary: { val: '#1E1B16' },
    borderColor: { val: 'rgba(255, 255, 255, 0.1)' },
    surface: { val: '#161410' },
    textTertiary: { val: '#6B6352' },
  }),
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('BodyAnatomySvg', () => {
  it('renders correctly for front view', () => {
    const { toJSON } = render(
      <BodyAnatomySvg viewType="front" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly for back view', () => {
    const { toJSON } = render(
      <BodyAnatomySvg viewType="back" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('highlights primary muscles correctly', () => {
    const { toJSON } = render(
      <BodyAnatomySvg primaryMuscles={['chest', 'biceps']} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('highlights secondary muscles correctly', () => {
    const { toJSON } = render(
      <BodyAnatomySvg secondaryMuscles={['triceps', 'lats']} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
