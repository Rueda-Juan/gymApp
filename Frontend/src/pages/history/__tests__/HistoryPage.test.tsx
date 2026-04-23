import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import HistoryPage from '../HistoryPage';
import { useWorkout } from '@/shared/api';

// Mocks
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(() => {
        const cleanup = callback();
        return () => { if (typeof cleanup === 'function') cleanup(); };
      }, [callback]);
    }),
  };
});

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));



jest.mock('@/shared/api', () => ({
  ...jest.requireActual('@/shared/api'),
  useWorkout: jest.fn(),
}));

jest.mock('@/entities/workout', () => ({
  HistoryWorkoutCard: ({ item, onDelete }: any) => {
    const { Button, Text, View } = require('react-native');
    return (
      <View>
        <Text>{`Entrenamiento ${item.id}`}</Text>
        <Button title="Eliminar" onPress={() => onDelete(item.id, 'Hoy')} />
      </View>
    );
  },
}));

jest.mock('@/entities/stats', () => ({
  groupWorkoutsByPeriod: jest.fn((workouts) => 
    workouts.length > 0 ? [{ title: 'Abril 2026', data: workouts }] : []
  ),
}));

jest.mock('@/shared/ui', () => {
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  return {
    Screen: ({ children }: any) => <View>{children}</View>,
    AppText: ({ children }: any) => <Text>{children}</Text>,
    AppIcon: () => null,
    IconButton: ({ onPress, accessibilityLabel }: any) => (
      <TouchableOpacity onPress={onPress} testID={accessibilityLabel}>
        <Text>Icon</Text>
      </TouchableOpacity>
    ),
    SearchBar: ({ value, onChangeText, placeholder }: any) => (
      <TextInput 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        testID="search-bar"
      />
    ),
    ContentReveal: ({ children, loading, skeleton }: any) => loading ? skeleton : children,
    EmptyStateIcon: () => null,
  };
});

jest.mock('@/shared/ui/layout/Loaders', () => ({
  HistoryCardSkeleton: () => {
    const { Text } = require('react-native');
    return <Text>Skeleton...</Text>;
  },
}));

describe('HistoryPage', () => {
  const mockWorkouts = [
    { id: '1', date: '2026-04-20T10:00:00Z', durationSeconds: 3600, notes: 'Pecho y Triceps' },
    { id: '2', date: '2026-04-18T10:00:00Z', durationSeconds: 4500, notes: 'Espalda y Biceps' },
  ];

  const mockGetHistory = jest.fn();
  const mockDeleteWorkout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useWorkout as unknown as jest.Mock).mockReturnValue({
      getHistory: mockGetHistory,
      deleteWorkout: mockDeleteWorkout,
    });
    mockGetHistory.mockResolvedValue(mockWorkouts);
    jest.spyOn(Alert, 'alert');
  });

  it('renderiza skeleton inicialmente y luego carga los entrenamientos', async () => {
    const { getByText, getAllByText } = render(<HistoryPage />);
    
    expect(getAllByText('Skeleton...').length).toBeGreaterThan(0);
    
    await waitFor(() => {
      expect(mockGetHistory).toHaveBeenCalledWith(50);
      expect(getByText('Entrenamiento 1')).toBeTruthy();
      expect(getByText('Entrenamiento 2')).toBeTruthy();
      expect(getByText('ABRIL 2026')).toBeTruthy();
    });
  });

  it('muestra el estado vacío si no hay entrenamientos', async () => {
    mockGetHistory.mockResolvedValue([]);
    const { getByText } = render(<HistoryPage />);
    
    await waitFor(() => {
      expect(getByText('No hay entrenamientos guardados aún')).toBeTruthy();
    });
  });

  it('filtra los entrenamientos mediante la búsqueda', async () => {
    const { getByTestId, getByText, queryByText } = render(<HistoryPage />);
    
    await waitFor(() => expect(getByText('Entrenamiento 1')).toBeTruthy());
    
    // Abrir búsqueda
    fireEvent.press(getByTestId('Abrir búsqueda'));
    
    const searchBar = getByTestId('search-bar');
    fireEvent.changeText(searchBar, 'Pecho');
    
    expect(getByText('Entrenamiento 1')).toBeTruthy();
    expect(queryByText('Entrenamiento 2')).toBeNull();
  });

  it('maneja la eliminación de un entrenamiento con éxito', async () => {
    const { getByText, getAllByText, queryByText } = render(<HistoryPage />);
    
    await waitFor(() => expect(getByText('Entrenamiento 1')).toBeTruthy());
    
    const deleteButtons = getAllByText('Eliminar');
    fireEvent.press(deleteButtons[0]);
    
    // Verificar alerta
    expect(Alert.alert).toHaveBeenCalledWith(
      '¿Eliminar Entrenamiento?',
      expect.any(String),
      expect.any(Array)
    );
    
    // Simular confirmación de alerta
    const confirmDelete = (Alert.alert as unknown as jest.Mock).mock.calls[0][2][1].onPress;
    const { act } = require('react-test-renderer');
    await act(async () => {
      await confirmDelete();
    });
    
    expect(mockDeleteWorkout).toHaveBeenCalledWith('1');
    expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({
      type: 'success',
      text1: 'Entrenamiento eliminado',
    }));
    
    await waitFor(() => {
      expect(queryByText('Entrenamiento 1')).toBeNull();
    });
  });

  it('muestra error si la carga de historial falla', async () => {
    mockGetHistory.mockRejectedValue(new Error('Fetch failed'));
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({
        type: 'error',
        text1: 'Error al cargar historial',
      }));
    });
  });

  it('muestra error si la eliminación falla', async () => {
    mockDeleteWorkout.mockRejectedValue(new Error('Delete failed'));
    const { getByText, getAllByText } = render(<HistoryPage />);
    
    await waitFor(() => expect(getByText('Entrenamiento 1')).toBeTruthy());
    
    const deleteButtons = getAllByText('Eliminar');
    fireEvent.press(deleteButtons[0]);
    
    const confirmDelete = (Alert.alert as unknown as jest.Mock).mock.calls[0][2][1].onPress;
    await confirmDelete();
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo eliminar el entrenamiento.');
    });
  });
});
