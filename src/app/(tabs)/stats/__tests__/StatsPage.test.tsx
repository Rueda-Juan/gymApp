import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StatsPage from '../index';

// Mocks
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef(({ children }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        expand: jest.fn(),
        close: jest.fn(),
      }));
      return <View testID="bottom-sheet">{children}</View>;
    }),
    BottomSheetFlatList: ({ data, renderItem }: any) => (
      <View testID="bottom-sheet-list">
        {data.map((item: any, index: number) => (
          <View key={item.id || index}>
            {renderItem({ item, index })}
          </View>
        ))}
      </View>
    ),
    BottomSheetView: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('@/shared/ui', () => {
  const React = require('react');
  const { View, Text, Button } = require('react-native');
  return {
    AppText: ({ children }: any) => <Text>{children}</Text>,
    AppIcon: () => null,
    Screen: ({ children }: any) => <View>{children}</View>,
    CardBase: ({ children }: any) => <View>{children}</View>,
    ContentReveal: ({ children, loading, skeleton }: any) => loading ? skeleton : children,
    IconButton: ({ onPress, icon }: any) => <Button title="Icon" onPress={onPress} />,
    AppButton: ({ label, onPress }: any) => <Button title={label} onPress={onPress} />,
    AppInput: (props: any) => <View {...props} />,
  };
});

jest.mock('@/shared/ui/charts/PlaceholderCharts', () => ({
  WeeklyVolumeBarChart: () => null,
  ActivityGrid: () => null,
}));

jest.mock('@/shared/ui/layout/Loaders', () => ({
  StatsPageSkeleton: () => null,
}));

jest.mock('@/entities/stats/model/useStatsData', () => ({
  useStatsData: jest.fn(() => ({
    loading: false,
    stats: { weeklyStats: [] },
    weightHistory: [],
    summaries: { workouts: 0, volume: 0, time: 0, prs: 0 },
    trainedDates: new Set(),
  })),
}));

jest.mock('@/entities/stats', () => ({
  useStats: jest.fn(),
  useBodyWeight: jest.fn(() => ({
    logBodyWeight: jest.fn(),
  })),
  BodyWeightCard: () => null,
  StrengthProgressCard: ({ onOpenExercisePicker }: any) => {
    const { Button } = require('react-native');
    return <Button title="Open Picker" onPress={onOpenExercisePicker} />;
  },
  StatsSummaryGrid: () => null,
}));

jest.mock('@/entities/exercise', () => ({
  getExerciseName: jest.fn((ex: any) => ex?.name || 'Unknown'),
  useExerciseDb: jest.fn(() => ({
    getExercises: jest.fn().mockResolvedValue([{ id: 'ex-1', name: 'Bench Press' }]),
    getExerciseHistory: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock('@/entities/workout', () => ({
  calculateEpley1RM: jest.fn(() => 100),
}));



describe('StatsPage', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renderiza el título correctamente', () => {
    const { getByText } = render(<StatsPage />);
    expect(getByText('Estadísticas')).toBeTruthy();
  });

  it('muestra el selector de ejercicios al presionar en StrengthProgressCard', async () => {
    const { getByText, getByTestId } = render(<StatsPage />);
    const openPickerButton = getByText('Open Picker');

    fireEvent.press(openPickerButton);

    await waitFor(() => {
      expect(getByText('Seleccionar ejercicio')).toBeTruthy();
    });
  });

  it('carga la lista de ejercicios al abrir el selector', async () => {
    const { getByText } = render(<StatsPage />);
    const openPickerButton = getByText('Open Picker');

    fireEvent.press(openPickerButton);

    await waitFor(() => {
      expect(getByText('Bench Press')).toBeTruthy();
    });
  });
});
