import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActiveWorkoutBottomBar } from '@/widgets/activeWorkout/ui/ActiveWorkoutBottomBar';

const mockSetBottomBarHeight = jest.fn();

jest.mock('@/shared/context/BottomBarHeightContext', () => ({
  useBottomBarHeightContext: () => ({ bottomBarHeight: 0, setBottomBarHeight: mockSetBottomBarHeight, safeAreaBottom: 0 }),
}));

describe('ActiveWorkoutBottomBar layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls setBottomBarHeight with measured height (no double-counting)', () => {
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
    } as any;

    const { getByTestId } = render(<ActiveWorkoutBottomBar {...baseProps} />);

    const root = getByTestId('ActiveWorkoutBottomBar');
    fireEvent(root, 'layout', { nativeEvent: { layout: { height: 150 } } });

    expect(mockSetBottomBarHeight).toHaveBeenCalledWith(150);
  });
});
