import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActiveWorkoutBottomBar } from '../ActiveWorkoutBottomBar';

describe('ActiveWorkoutBottomBar', () => {
  const baseProps = {
    isFirst: false,
    isLast: false,
    isFinishing: false,
    sessionNote: undefined,
    restTimerIsActive: false,
    restDisplaySeconds: 0,
    insetsBottom: 20,
    hourglassAnimatedStyle: {},
    onPrev: jest.fn(),
    onOpenNote: jest.fn(),
    onOpenRestTimer: jest.fn(),
    onNext: jest.fn(),
    onOpenPlateCalculator: jest.fn(),
    nextExerciseName: 'Sentadilla',
  };

  it('renders next exercise button and handles press', () => {
    const { getByA11yLabel } = render(
      <ActiveWorkoutBottomBar {...baseProps} />
    );
    const nextButton = getByA11yLabel('Siguiente ejercicio');
    fireEvent.press(nextButton);
    expect(baseProps.onNext).toHaveBeenCalled();
  });

  it('shows "Finalizar" when isLast', () => {
    const { getByA11yLabel, getByText } = render(
      <ActiveWorkoutBottomBar {...baseProps} isLast />
    );
    expect(getByA11yLabel('Finalizar entrenamiento')).toBeTruthy();
    expect(getByText('Finalizar')).toBeTruthy();
  });

  it('disables next button when isFinishing', () => {
    const { getByA11yLabel } = render(
      <ActiveWorkoutBottomBar {...baseProps} isFinishing />
    );
    const nextButton = getByA11yLabel('Siguiente ejercicio');
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
  });
});
