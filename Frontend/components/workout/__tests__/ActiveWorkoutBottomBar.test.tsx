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
    const { getByLabelText } = render(
      <ActiveWorkoutBottomBar {...baseProps} />
    );
    const nextButton = getByLabelText('Siguiente ejercicio');
    fireEvent.press(nextButton);
    expect(baseProps.onNext).toHaveBeenCalled();
  });

  it('shows "Finalizar" when isLast', () => {
    const { getByLabelText, getByText } = render(
      <ActiveWorkoutBottomBar {...baseProps} isLast />
    );
    expect(getByLabelText('Finalizar entrenamiento')).toBeTruthy();
    expect(getByText('Finalizar')).toBeTruthy();
  });

  it('disables next button when isFinishing', () => {
    const { getByLabelText } = render(
      <ActiveWorkoutBottomBar {...baseProps} isFinishing />
    );
    const nextButton = getByLabelText('Siguiente ejercicio');
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
  });
});
