import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import ExerciseCreatePage from '../index';
import { useExerciseDb } from '@/entities/exercise';

// Mocks
jest.mock('@/entities/exercise', () => ({
  useExerciseDb: jest.fn(),
}));
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@/features/exercise', () => {
  const { View, Text, Button, TextInput } = require('react-native');
  return {
    CreateExerciseHeader: ({ onSave, onClose, isSaving }: any) => (
      <View>
        <Button title="Guardar" onPress={onSave} disabled={isSaving} />
        <Button title="Cerrar" onPress={onClose} />
      </View>
    ),
    CreateExerciseForm: ({ name, setName, primaryMuscles, setPrimaryMuscles, equipment, handleSetEquipment }: any) => (
      <View>
        <TextInput 
          placeholder="Nombre" 
          value={name} 
          onChangeText={setName} 
          testID="name-input"
        />
        <Button title="Add Pecho" onPress={() => setPrimaryMuscles(['chest'])} />
        <Button title="Set Barbell" onPress={() => handleSetEquipment('barbell')} />
      </View>
    ),
  };
});

describe('ExerciseCreatePage', () => {
  const mockCreateCustomExercise = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useExerciseDb as unknown as jest.Mock).mockReturnValue({
      createCustomExercise: mockCreateCustomExercise,
    });
  });

  it('valida campos obligatorios antes de guardar', async () => {
    const { getByText, getByTestId } = render(<ExerciseCreatePage />);
    
    // 1. Sin nombre
    fireEvent.press(getByText('Guardar'));
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'El nombre es obligatorio',
    });
    jest.clearAllMocks();

    // 2. Con nombre, sin músculos primarios
    fireEvent.changeText(getByTestId('name-input'), 'Press de Banca');
    fireEvent.press(getByText('Guardar'));
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Seleccioná al menos un músculo primario',
    });
    jest.clearAllMocks();

    // 3. Con nombre y músculos, sin equipamiento
    fireEvent.press(getByText('Add Pecho'));
    fireEvent.press(getByText('Guardar'));
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Seleccioná el equipamiento',
    });
  });

  it('crea el ejercicio exitosamente y vuelve atrás', async () => {
    mockCreateCustomExercise.mockResolvedValue({ id: 'new-ex' });
    const { getByText, getByTestId } = render(<ExerciseCreatePage />);
    
    fireEvent.changeText(getByTestId('name-input'), 'Sentadilla');
    fireEvent.press(getByText('Add Pecho')); // Aunque sea sentadilla, para el test
    fireEvent.press(getByText('Set Barbell'));
    
    fireEvent.press(getByText('Guardar'));
    
    await waitFor(() => {
      expect(mockCreateCustomExercise).toHaveBeenCalledWith({
        name: 'Sentadilla',
        primaryMuscles: ['chest'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'compound',
        loadType: 'weighted',
      });
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Ejercicio creado con éxito',
      });
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('muestra un error si la creación falla', async () => {
    mockCreateCustomExercise.mockRejectedValue(new Error('Save failed'));
    const { getByText, getByTestId } = render(<ExerciseCreatePage />);
    
    fireEvent.changeText(getByTestId('name-input'), 'Error Ex');
    fireEvent.press(getByText('Add Pecho'));
    fireEvent.press(getByText('Set Barbell'));
    
    fireEvent.press(getByText('Guardar'));
    
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error al crear el ejercicio',
      });
      expect(router.back).not.toHaveBeenCalled();
    });
  });

  it('vuelve atrás al presionar cerrar', () => {
    const { getByText } = render(<ExerciseCreatePage />);
    fireEvent.press(getByText('Cerrar'));
    expect(router.back).toHaveBeenCalled();
  });
});
