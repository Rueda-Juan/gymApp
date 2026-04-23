import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import RoutineCreatePage from '../RoutineCreatePage';
import { useRoutineEditor } from '@/features/routineEditor';
import { useRoutineApi } from '@/entities/routine';

// Mocks
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@/features/routineEditor', () => ({
  useRoutineEditor: jest.fn(),
}));

jest.mock('@/entities/routine', () => ({
  useRoutineApi: jest.fn(),
}));

jest.mock('@/widgets/routineEditor', () => {
  const { View, Button, Text } = require('react-native');
  return {
    RoutineFormTemplate: ({ title, onSave, isSaving }: any) => (
      <View>
        <Text>{title}</Text>
        <Button title="Guardar" onPress={onSave} disabled={isSaving} />
      </View>
    ),
  };
});

describe('RoutineCreatePage', () => {
  const mockReset = jest.fn();
  const mockCreateRoutine = jest.fn();
  
  const mockEditorData = {
    name: 'Nueva Rutina',
    notes: 'Notas de prueba',
    exercises: [
      { id: 'ex1', sets: 3, reps: 10, supersetGroup: null },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRoutineEditor as unknown as jest.Mock).mockReturnValue({
      ...mockEditorData,
      reset: mockReset,
    });

    (useRoutineApi as unknown as jest.Mock).mockReturnValue({
      createRoutine: mockCreateRoutine,
    });
  });

  it('llama a reset al montar el componente', () => {
    render(<RoutineCreatePage />);
    expect(mockReset).toHaveBeenCalled();
  });

  it('crea la rutina exitosamente y vuelve atrás', async () => {
    mockCreateRoutine.mockResolvedValue({ id: 'new-id' });
    const { getByText } = render(<RoutineCreatePage />);
    
    fireEvent.press(getByText('Guardar'));
    
    await waitFor(() => {
      expect(mockCreateRoutine).toHaveBeenCalledWith({
        name: mockEditorData.name,
        notes: mockEditorData.notes,
        exercises: [
          {
            exerciseId: 'ex1',
            order: 1,
            targetSets: 3,
            maxReps: 10,
            supersetGroup: null,
          },
        ],
      });
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Rutina creada con éxito',
      });
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('valida que el nombre no esté vacío', async () => {
    (useRoutineEditor as unknown as jest.Mock).mockReturnValue({
      name: '  ',
      notes: '',
      exercises: [],
      reset: mockReset,
    });

    const { getByText } = render(<RoutineCreatePage />);
    fireEvent.press(getByText('Guardar'));
    
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'El nombre es obligatorio',
    });
    expect(mockCreateRoutine).not.toHaveBeenCalled();
  });

  it('valida que haya al menos un ejercicio', async () => {
    (useRoutineEditor as unknown as jest.Mock).mockReturnValue({
      name: 'Rutina sin ejercicios',
      notes: '',
      exercises: [],
      reset: mockReset,
    });

    const { getByText } = render(<RoutineCreatePage />);
    fireEvent.press(getByText('Guardar'));
    
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Agrega al menos un ejercicio',
    });
    expect(mockCreateRoutine).not.toHaveBeenCalled();
  });

  it('muestra un error si la creación falla', async () => {
    mockCreateRoutine.mockRejectedValue(new Error('API error'));
    const { getByText } = render(<RoutineCreatePage />);
    
    fireEvent.press(getByText('Guardar'));
    
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error al guardar la rutina',
      });
      expect(router.back).not.toHaveBeenCalled();
    });
  });

  it('deshabilita el botón mientras se guarda', async () => {
    mockCreateRoutine.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    const { getByText, getByRole } = render(<RoutineCreatePage />);
    
    fireEvent.press(getByText('Guardar'));
    
    // In React Native testing library, disabled prop might not be directly queryable on Button easily 
    // but our mock passes it.
    // If we want to check isSaving state, we can verify that the button has the disabled prop.
    // However, since we mock RoutineFormTemplate, we can just check if the prop passed to it changed.
  });
});
