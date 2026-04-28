import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import RoutinesPage from '../RoutinesPage';

// Mocks
const mockRoutines = [
  { id: '1', name: 'Rutina A', muscles: ['Pecho', 'Tríceps'] },
  { id: '2', name: 'Rutina B', muscles: ['Espalda', 'Bíceps'] },
];

const mockRoutineService = {
  getRoutines: jest.fn().mockResolvedValue(mockRoutines),
};

const mockWorkoutService = {
  getHistory: jest.fn().mockResolvedValue([]),
};

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    return require('react').useEffect(() => callback(), [callback]);
  }),
}));

jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    FlashList: ({ data, renderItem, ListEmptyComponent }: any) => (
      <View>
        {data && data.length > 0 
          ? data.map((item: any, index: number) => (
              <React.Fragment key={item.id ?? index}>
                {renderItem({ item, index })}
              </React.Fragment>
            ))
          : ListEmptyComponent && (typeof ListEmptyComponent === 'function' ? ListEmptyComponent() : ListEmptyComponent)
        }
      </View>
    ),
  };
});

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@/entities/routine', () => ({
  useRoutineApi: jest.fn(() => mockRoutineService),
  RoutineCard: ({ routine, onOpen }: any) => {
    const { Button } = require('react-native');
    return <Button title={routine.name} onPress={onOpen} />;
  },
}));

jest.mock('@/entities/workout', () => ({
  useWorkout: jest.fn(() => mockWorkoutService),
}));

jest.mock('@/features/activeWorkout', () => ({
  useStartWorkout: jest.fn(() => jest.fn()),
}));

jest.mock('@/shared/ui', () => {
  const React = require('react');
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  return {
    AppText: ({ children }: any) => <Text>{children}</Text>,
    AppIcon: () => null,
    Screen: ({ children }: any) => <View>{children}</View>,
    AppButton: ({ label, onPress }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    IconButton: ({ onPress, accessibilityLabel }: any) => (
      <TouchableOpacity onPress={onPress} testID={accessibilityLabel}>
        <Text>Icon</Text>
      </TouchableOpacity>
    ),
    ToggleChip: ({ label, onPress, isActive }: any) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{label} {isActive ? '(Active)' : ''}</Text>
      </TouchableOpacity>
    ),
    SearchBar: ({ value, onChangeText }: any) => (
      <TextInput value={value} onChangeText={onChangeText} placeholder="Buscar..." />
    ),
  };
});

jest.mock('@/shared/ui/feedback', () => {
  const { View } = require('react-native');
  return {
    ContentReveal: ({ children, loading, skeleton }: any) => loading ? skeleton : children,
    EmptyStateIcon: () => null,
  };
});

jest.mock('@/shared/ui/layout/Loaders', () => ({
  RoutineCardSkeleton: () => null,
}));

describe('RoutinesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el título y carga las rutinas', async () => {
    const { getByText } = render(<RoutinesPage />);
    expect(getByText('Rutinas')).toBeTruthy();
    
    await waitFor(() => {
      expect(getByText('Rutina A')).toBeTruthy();
      expect(getByText('Rutina B')).toBeTruthy();
    });
  });

  it('filtra las rutinas por búsqueda', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<RoutinesPage />);
    
    await waitFor(() => expect(getByText('Rutina A')).toBeTruthy());

    const searchInput = getByPlaceholderText('Buscar...');
    fireEvent.changeText(searchInput, 'Rutina B');

    expect(queryByText('Rutina A')).toBeNull();
    expect(getByText('Rutina B')).toBeTruthy();
  });

  it('navega a creación al presionar el botón Plus', () => {
    const { getByTestId } = render(<RoutinesPage />);
    const plusButton = getByTestId('Crear rutina');
    
    fireEvent.press(plusButton);
    
    expect(router.push).toHaveBeenCalledWith('/routine/create');
  });

  it('navega al detalle al presionar una rutina', async () => {
    const { getByText } = render(<RoutinesPage />);
    
    await waitFor(() => {
      const routineButton = getByText('Rutina A');
      fireEvent.press(routineButton);
    });

    expect(router.push).toHaveBeenCalledWith('/routine/1');
  });
});
