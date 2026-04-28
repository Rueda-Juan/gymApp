import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import RoutineDetailPage from '../RoutineDetailPage';
import { useRoutineEditor } from '@/features/editRoutine';
import { useRoutineApi } from '@/entities/routine';

// Mocks
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@/features/editRoutine', () => ({
  useRoutineEditor: jest.fn(),
}));

jest.mock('@/entities/routine', () => ({
  useRoutineApi: jest.fn(),
}));

jest.mock('@/shared/ui', () => {
  const { Text } = require('react-native');
  return {
    LoadingSkeleton: () => <Text>Loading...</Text>,
  };
});

jest.mock('@/widgets/routineEditor', () => {
  const { View, Button, Text } = require('react-native');
  return {
    RoutineFormTemplate: ({ title, onSave, onDelete, isSaving }: any) => (
      <View>
        <Text>{title}</Text>
        <Button title="Guardar" onPress={onSave} disabled={isSaving} />
        <Button title="Eliminar" onPress={onDelete} />
      </View>
    ),
  };
});

describe('RoutineDetailPage', () => {
  const mockId = '123';
  const mockRoutine = {
    id: '123',
    name: 'Rutina de Prueba',
    notes: 'Algunas notas',
    exercises: [
      { id: 'ex1', name: 'Ejercicio 1', sets: 3, reps: 10 },
    ],
  };

  const mockLoadRoutine = jest.fn();
  const mockReset = jest.fn();
  const mockGetRoutineById = jest.fn();
  const mockUpdateRoutine = jest.fn();
  const mockDeleteRoutine = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as unknown as jest.Mock).mockReturnValue({ id: mockId });
    
    (useRoutineEditor as unknown as jest.Mock).mockReturnValue({
      name: mockRoutine.name,
      notes: mockRoutine.notes,
      exercises: mockRoutine.exercises,
      loadRoutine: mockLoadRoutine,
      reset: mockReset,
    });

    (useRoutineApi as unknown as jest.Mock).mockReturnValue({
      getRoutineById: mockGetRoutineById,
      updateRoutine: mockUpdateRoutine,
      deleteRoutine: mockDeleteRoutine,
    });

    mockGetRoutineById.mockResolvedValue(mockRoutine);
  });

  it('renderiza LoadingSkeleton inicialmente y carga los datos', async () => {
    const { getByText, queryByText } = render(<RoutineDetailPage />);
    
    expect(getByText('Loading...')).toBeTruthy();
    
    await waitFor(() => {
      expect(mockGetRoutineById).toHaveBeenCalledWith(mockId);
      expect(mockLoadRoutine).toHaveBeenCalledWith(mockRoutine);
      expect(queryByText('Loading...')).toBeNull();
      expect(getByText(mockRoutine.name)).toBeTruthy();
    });
  });

  it('muestra un error y vuelve atrás si la carga falla', async () => {
    mockGetRoutineById.mockRejectedValue(new Error('Fetch failed'));
    
    render(<RoutineDetailPage />);
    
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error al cargar la rutina',
      });
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('valida que el nombre no esté vacío al guardar', async () => {
    (useRoutineEditor as jest.Mock).mockReturnValue({
      name: '',
      notes: '',
      exercises: [],
      loadRoutine: mockLoadRoutine,
      reset: mockReset,
    });

    const { getByText } = render(<RoutineDetailPage />);
    
    await waitFor(() => expect(getByText('Guardar')).toBeTruthy());
    
    fireEvent.press(getByText('Guardar'));
    
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'El nombre es obligatorio',
    });
    expect(mockUpdateRoutine).not.toHaveBeenCalled();
  });

  it('actualiza la rutina exitosamente y vuelve atrás', async () => {
    mockUpdateRoutine.mockResolvedValue({ success: true });
    const { getByText } = render(<RoutineDetailPage />);
    
    await waitFor(() => expect(getByText('Guardar')).toBeTruthy());
    
    fireEvent.press(getByText('Guardar'));
    
    await waitFor(() => {
      expect(mockUpdateRoutine).toHaveBeenCalledWith(mockId, {
        name: mockRoutine.name,
        notes: mockRoutine.notes,
        exercises: mockRoutine.exercises.map((ex, index) => ({
          exerciseId: ex.id,
          order: index + 1,
          targetSets: ex.sets,
          maxReps: ex.reps,
          supersetGroup: undefined,
        })),
      });
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Rutina actualizada',
      });
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('muestra un error si la actualización falla', async () => {
    mockUpdateRoutine.mockRejectedValue(new Error('Update failed'));
    const { getByText } = render(<RoutineDetailPage />);
    
    await waitFor(() => expect(getByText('Guardar')).toBeTruthy());
    
    fireEvent.press(getByText('Guardar'));
    
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error al actualizar la rutina',
      });
      expect(router.back).not.toHaveBeenCalled();
    });
  });

  it('elimina la rutina exitosamente y vuelve atrás', async () => {
    mockDeleteRoutine.mockResolvedValue({ success: true });
    const { getByText } = render(<RoutineDetailPage />);
    
    await waitFor(() => expect(getByText('Eliminar')).toBeTruthy());
    
    fireEvent.press(getByText('Eliminar'));
    
    await waitFor(() => {
      expect(mockDeleteRoutine).toHaveBeenCalledWith(mockId);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: 'Rutina eliminada',
      });
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('muestra un error si la eliminación falla', async () => {
    mockDeleteRoutine.mockRejectedValue(new Error('Delete failed'));
    const { getByText } = render(<RoutineDetailPage />);
    
    await waitFor(() => expect(getByText('Eliminar')).toBeTruthy());
    
    fireEvent.press(getByText('Eliminar'));
    
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error al eliminar la rutina',
      });
      expect(router.back).not.toHaveBeenCalled();
    });
  });

  it('llama a reset al desmontar el componente', async () => {
    const { unmount } = render(<RoutineDetailPage />);
    await waitFor(() => expect(mockGetRoutineById).toHaveBeenCalled());
    
    unmount();
    expect(mockReset).toHaveBeenCalled();
  });

  it('maneja el caso donde el id no está presente', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
    
    render(<RoutineDetailPage />);
    
    // Si no hay id, el useEffect retorna temprano y no llama a getRoutineById
    await waitFor(() => {
      expect(mockGetRoutineById).not.toHaveBeenCalled();
    });
  });
});
