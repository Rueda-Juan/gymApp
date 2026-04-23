import { renderHook, waitFor } from '@testing-library/react-native';
import { useWorkout } from '../workout/useWorkoutApi';
import { api } from '../base';
import { DIProvider } from '../../context/DIContext';
import React from 'react';

// Mock Axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

describe('Workout API Service Integration', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DIProvider>{children}</DIProvider>
  );

  it('provides workout actions through DI', async () => {
    const { result } = renderHook(() => useWorkout(), { wrapper });

    await waitFor(() => {
      expect(result.current.startWorkout).toBeDefined();
      expect(result.current.getHistory).toBeDefined();
    });
  });
});
