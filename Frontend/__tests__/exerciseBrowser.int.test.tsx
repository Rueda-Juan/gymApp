import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';

// Mutable holders to allow tests to change implementations at runtime
let mockFocusCallbacks: Array<() => any> = [];
let mockGetAll: jest.Mock<any, any> = jest.fn();
const mockCreateCustomExercise = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: any) => {
    // register the focus callback for the test to invoke when appropriate
    if (!mockFocusCallbacks.includes(cb)) mockFocusCallbacks.push(cb);
    // return a cleanup to allow removal if the component unmounts
    return () => {
      const idx = mockFocusCallbacks.indexOf(cb);
      if (idx !== -1) mockFocusCallbacks.splice(idx, 1);
    };
  },
}));

jest.mock('@/hooks/domain/useExercises', () => {
  // return a stable service object to avoid identity changes across renders
  const service: any = {
    getAll: (...args: any[]) => mockGetAll(...args),
    createCustomExercise: mockCreateCustomExercise,
  };
  return { useExercises: () => service };
});

jest.mock('@/hooks/application/useExerciseFiltering', () => ({
  useExerciseFiltering: (exercises: any[]) => ({
    filteredExercises: exercises,
    filters: { search: '', muscleFilter: '', equipmentFilter: '', customOnly: false },
    setFilter: jest.fn(),
  }),
}));

jest.mock('@shopify/flash-list', () => {
  return {
    FlashList: ({ data, renderItem, ListEmptyComponent }: any) => {
      const React = require('react');
      if (!data || data.length === 0) return ListEmptyComponent ? ListEmptyComponent : null;
      return data.map((item: any, i: number) => React.createElement(React.Fragment, { key: item.id ?? i }, renderItem({ item, index: i })));
    },
  };
});

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  router: { push: jest.fn(), back: jest.fn() },
}));

import ExerciseBrowserScreen from '@/app/(workouts)/exercise-browser';

function TamagiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {children}
    </TamaguiProvider>
  );
}

const renderWithProviders = (component: React.ReactElement) => render(
  <SafeAreaProvider
    initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
  >
    <TamagiProviderWrapper>
      {component}
    </TamagiProviderWrapper>
  </SafeAreaProvider>
);

describe('ExerciseBrowser integration (focus reload)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFocusCallbacks = [];
  });

  it('loads exercises on focus and shows newly created exercise after re-focus', async () => {
    const initialExercises = [
      { id: '1', name: 'Init Exercise', nameEs: 'Init Exercise', primaryMuscles: ['chest'], equipment: 'dumbbell' },
    ];

    const createdExercise = { id: '2', name: 'Press de pecho', nameEs: 'Press de pecho', primaryMuscles: ['chest'], equipment: 'dumbbell' };

    // currentExercises is read by mockGetAll at call time
    let currentExercises = [...initialExercises];

    mockGetAll = jest.fn().mockImplementation(() => Promise.resolve(currentExercises));

    const { getByText } = renderWithProviders(<ExerciseBrowserScreen />);

    // debug: ensure focus callback registered
    // eslint-disable-next-line no-console
    console.log('DEBUG: mockFocusCallbacks.length=', mockFocusCallbacks.length);

    // simulate initial focus callbacks (component mounts)
    for (const cb of mockFocusCallbacks) {
      try {
        const { act } = require('react-test-renderer');
        // eslint-disable-next-line no-await-in-loop
        await act(async () => { cb(); await new Promise((r) => setImmediate(r)); });
      } catch (e) { /* ignore */ }
    }

    // debug removed

    // initial load should render the initial exercise
    await waitFor(() => expect(getByText('Init Exercise')).toBeTruthy());
    // debug: was the service called?
    // eslint-disable-next-line no-console
    console.log('DEBUG: mockGetAll.calls=', mockGetAll.mock ? mockGetAll.mock.calls.length : 'no-mock');

    // initial load should render the initial exercise
    await waitFor(() => expect(getByText('Init Exercise')).toBeTruthy());
    currentExercises = [...initialExercises, createdExercise];
    mockGetAll.mockImplementation(() => Promise.resolve(currentExercises));

    // Trigger focus callbacks (simulate navigating back to the screen)
    for (const cb of mockFocusCallbacks) {
      try {
        const { act } = require('react-test-renderer');
        // ensure we await async state updates started by the focus callback
        // eslint-disable-next-line no-await-in-loop
        await act(async () => { cb(); await new Promise((r) => setImmediate(r)); });
      } catch (e) { /* ignore */ }
    }

    // Expect the newly created exercise to appear after re-fetch
    await waitFor(() => expect(getByText('Press de pecho')).toBeTruthy());
  });
});
