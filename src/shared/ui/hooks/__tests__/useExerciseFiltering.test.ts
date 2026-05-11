import { renderHook } from '@testing-library/react-native';
import { useExerciseFiltering } from '../useExerciseFiltering';
import type { Exercise } from '@kernel';

describe('useExerciseFiltering', () => {
  const mockExercises: Exercise[] = [
    { 
      id: '1', 
      name: 'Press de Banca', 
      primaryMuscles: ['chest'], 
      secondaryMuscles: ['triceps'],
      type: 'compound',
      equipment: 'barbell',
      loadType: 'weighted'
    },
    { 
      id: '2', 
      name: 'Sentadilla', 
      primaryMuscles: ['quads'], 
      secondaryMuscles: ['glutes'],
      type: 'compound',
      equipment: 'barbell',
      loadType: 'weighted'
    },
    { 
      id: '3', 
      name: 'Aperturas', 
      primaryMuscles: ['chest'], 
      secondaryMuscles: [],
      type: 'isolation',
      equipment: 'dumbbells',
      loadType: 'weighted'
    },
  ] as any;

  it('retorna todos los ejercicios si no hay filtros', () => {
    const { result } = renderHook(() => useExerciseFiltering(mockExercises, '', ''));
    expect(result.current.filteredExercises).toHaveLength(3);
  });

  it('filtra por nombre (case insensitive)', () => {
    const { result } = renderHook(() => useExerciseFiltering(mockExercises, 'press', ''));
    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Press de Banca');
  });

  it('filtra por músculo primario', () => {
    const { result } = renderHook(() => useExerciseFiltering(mockExercises, '', 'quads'));
    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Sentadilla');
  });

  it('filtra por músculo secundario', () => {
    const { result } = renderHook(() => useExerciseFiltering(mockExercises, '', 'triceps'));
    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Press de Banca');
  });

  it('combina búsqueda y filtro de músculo', () => {
    const { result } = renderHook(() => useExerciseFiltering(mockExercises, 'aperturas', 'chest'));
    expect(result.current.filteredExercises).toHaveLength(1);
    expect(result.current.filteredExercises[0].name).toBe('Aperturas');

    const { result: emptyResult } = renderHook(() => useExerciseFiltering(mockExercises, 'sentadilla', 'chest'));
    expect(emptyResult.current.filteredExercises).toHaveLength(0);
  });

  it('maneja espacios en blanco en la búsqueda', () => {
    const { result } = renderHook(() => useExerciseFiltering(mockExercises, '  press  ', ''));
    expect(result.current.filteredExercises).toHaveLength(1);
  });
});
