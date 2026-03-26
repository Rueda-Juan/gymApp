import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from '@tamagui/core';
import '@tamagui/native/setup-zeego';
import config from '@/tamagui.config';
import { MiniPlayer } from '../mini-player';
import { useActiveWorkout } from '@/store/useActiveWorkout';

// Mock the hook and vector icons
jest.mock('@/store/useActiveWorkout');
jest.mock('lucide-react-native', () => ({
  ChevronRight: 'ChevronRight',
  Activity: 'Activity'
}));

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  }
}));

describe('MiniPlayer', () => {
  it('does not render when workout is inactive', () => {
    (useActiveWorkout as unknown as jest.Mock).mockReturnValue({
      isActive: false
    });

    const { toJSON } = render(<MiniPlayer />, {
      wrapper: ({ children }) => (
        <SafeAreaProvider>
          <TamaguiProvider config={config} defaultTheme="light">
            {children}
          </TamaguiProvider>
        </SafeAreaProvider>
      ),
    });
    expect(toJSON()).toBeNull();
  });

  it('renders the routine name when active', () => {
    (useActiveWorkout as unknown as jest.Mock).mockReturnValue({
      isActive: true,
      routineName: 'Push Day',
      startTime: Date.now(),
      currentExerciseIndex: 0,
      exercises: [
        { exerciseId: 'Bench Press' }
      ]
    });

    const { getByText } = render(<MiniPlayer />, {
      wrapper: ({ children }) => (
        <TamaguiProvider config={config} defaultTheme="light">
          {children}
        </TamaguiProvider>
      ),
    });
    expect(getByText('Push Day')).toBeTruthy();
  });
});
