import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import ExerciseListPage from '../index';
import { useExerciseDb } from '@/entities/exercise';
import { useExerciseFiltering } from '@/shared/ui/hooks/useExerciseFiltering';
import { ROUTES } from '@/shared/constants/routes';

// Mocks
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(() => {
        callback();
      }, [callback]);
    }),
  };
});

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    BottomSheetModal: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('@/entities/exercise', () => {
  const React = require('react');
  const { View, Text, Button } = require('react-native');
  return {
    ExerciseList: ({ exercises, onExercisePress, loading }: any) => (
      <View>
        {loading ? <Text>Loading...</Text> : (exercises || []).map((ex: any) => (
          <Button key={ex.id} title={ex.name} onPress={() => onExercisePress(ex)} />
        ))}
      </View>
    ),
    MuscleFilterSheet: React.forwardRef(({ onSelect, onClose }: any, ref: any) => {
      const { View, Button } = require('react-native');
      React.useImperativeHandle(ref, () => ({
        present: jest.fn(),
        dismiss: jest.fn(),
      }));
      return (
        <View>
          <Button title="Select Pecho" onPress={() => onSelect('Pecho')} />
          <Button title="Close" onPress={onClose} />
        </View>
      );
    }),
    useExerciseDb: jest.fn(),
  };
});

// useExerciseDb is mocked inside @/entities/exercise below

jest.mock('@/shared/ui/hooks/useExerciseFiltering', () => ({
  useExerciseFiltering: jest.fn((exercises) => ({ filteredExercises: exercises })),
}));

jest.mock('@/shared/ui', () => {
  const { View, Text, TextInput, TouchableOpacity } = require('react-native');
  return {
    Screen: ({ children }: any) => <View>{children}</View>,
    AppText: ({ children }: any) => <Text>{children}</Text>,
    AppButton: ({ label, onPress, icon }: any) => (
      <TouchableOpacity onPress={onPress} testID={label || 'button-icon'}>
        {icon}
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    AppIcon: () => null,
    SearchBar: ({ value, onChangeText, placeholder }: any) => (
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} />
    ),
  };
});

describe('ExerciseListPage', () => {
  const mockExercises = [
    { id: '1', name: 'Press de Banca', muscle: 'Pecho' },
    { id: '2', name: 'Sentadilla', muscle: 'Piernas' },
  ];

  const mockGetExercises = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useExerciseDb as unknown as jest.Mock).mockReturnValue({
      getExercises: mockGetExercises,
    });
    mockGetExercises.mockResolvedValue(mockExercises);
  });

  it('carga y renderiza la lista de ejercicios', async () => {
    const { getByText } = render(<ExerciseListPage />);
    
    expect(getByText('Loading...')).toBeTruthy();
    
    await waitFor(() => {
      expect(mockGetExercises).toHaveBeenCalled();
      expect(getByText('Press de Banca')).toBeTruthy();
      expect(getByText('Sentadilla')).toBeTruthy();
    });
  });

  it('navega a creación al presionar el botón de agregar', () => {
    const { getByTestId } = render(<ExerciseListPage />);
    const addButton = getByTestId('button-icon');
    
    fireEvent.press(addButton);
    
    expect(router.push).toHaveBeenCalledWith('/exercise/create');
  });

  it('navega al detalle al presionar un ejercicio', async () => {
    const { getByText } = render(<ExerciseListPage />);
    
    await waitFor(() => {
      const exerciseItem = getByText('Press de Banca');
      fireEvent.press(exerciseItem);
    });

    expect(router.push).toHaveBeenCalledWith(`${ROUTES.EXERCISE_BROWSER}/1`);
  });

  it('actualiza el filtro de búsqueda', async () => {
    const { getByPlaceholderText } = render(<ExerciseListPage />);
    const searchBar = getByPlaceholderText('Buscar ejercicio...');
    
    fireEvent.changeText(searchBar, 'Press');
    
    expect(useExerciseFiltering).toHaveBeenCalledWith(expect.any(Array), 'Press', '');
  });

  it('abre el filtro de músculos y selecciona uno', async () => {
    const { getByText } = render(<ExerciseListPage />);
    
    await waitFor(() => expect(getByText('Todos los músculos')).toBeTruthy());
    
    fireEvent.press(getByText('Todos los músculos'));
    
    fireEvent.press(getByText('Select Pecho'));
    
    expect(getByText('PECHO')).toBeTruthy();
    expect(useExerciseFiltering).toHaveBeenCalledWith(expect.any(Array), '', 'Pecho');
  });
});
