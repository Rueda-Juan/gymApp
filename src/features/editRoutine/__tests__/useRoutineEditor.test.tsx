import { renderHook, act } from '@testing-library/react-native';
import { useRoutineEditor } from '../hooks/useRoutineEditor';
import { useRoutineStore } from '@/entities/routine';

describe('useRoutineEditor', () => {
  beforeEach(() => {
    act(() => {
      useRoutineStore.getState().reset();
    });
  });

  it('inicializa con el estado por defecto', () => {
    const { result } = renderHook(() => useRoutineEditor());
    expect(result.current.name).toBe('');
    expect(result.current.notes).toBe('');
    expect(result.current.exercises).toEqual([]);
  });

  it('permite actualizar el nombre y las notas', () => {
    const { result } = renderHook(() => useRoutineEditor());
    
    act(() => {
      result.current.setName('Nueva Rutina');
      result.current.setNotes('Nota importante');
    });
    
    expect(result.current.name).toBe('Nueva Rutina');
    expect(result.current.notes).toBe('Nota importante');
  });

  it('permite gestionar ejercicios (añadir, actualizar, eliminar)', () => {
    const { result } = renderHook(() => useRoutineEditor());
    const exercise = { id: 'ex1', name: 'Press', muscle: 'Chest' };

    // Añadir
    act(() => {
      // @ts-ignore - addExercise no está en el hook pero sí en el store, 
      // lo añadiremos al hook para que sea consistente si es necesario, 
      // pero el usuario pidió tests para el editor.
      useRoutineStore.getState().addExercise(exercise);
    });
    expect(result.current.exercises).toHaveLength(1);
    expect(result.current.exercises[0].name).toBe('Press');

    // Actualizar
    act(() => {
      result.current.updateExercise('ex1', 4, '10-12');
    });
    expect(result.current.exercises[0].sets).toBe(4);
    expect(result.current.exercises[0].reps).toBe('10-12');

    // Eliminar
    act(() => {
      result.current.removeExercise('ex1');
    });
    expect(result.current.exercises).toHaveLength(0);
  });

  it('gestiona supersets (link/unlink)', () => {
    const { result } = renderHook(() => useRoutineEditor());
    
    act(() => {
      useRoutineStore.getState().addExercise({ id: 'ex1', name: 'E1', muscle: 'M1' });
      useRoutineStore.getState().addExercise({ id: 'ex2', name: 'E2', muscle: 'M1' });
      useRoutineStore.getState().addExercise({ id: 'ex3', name: 'E3', muscle: 'M1' });
    });

    // Link E1 y E2
    act(() => {
      result.current.linkExerciseNext(0);
    });
    expect(result.current.exercises[0].supersetGroup).not.toBeNull();
    expect(result.current.exercises[1].supersetGroup).toBe(result.current.exercises[0].supersetGroup);
    expect(result.current.exercises[2].supersetGroup).toBeUndefined();

    // Unlink E1
    act(() => {
      result.current.unlinkExercise(0);
    });
    expect(result.current.exercises[0].supersetGroup).toBeNull();
    expect(result.current.exercises[1].supersetGroup).not.toBeNull();
  });

  it('carga una rutina completa', () => {
    const { result } = renderHook(() => useRoutineEditor());
    const routine = {
      name: 'Rutina Cargada',
      notes: 'Notas',
      exercises: [
        { id: 'ex1', name: 'E1', sets: 5, reps: '5' }
      ]
    };

    act(() => {
      result.current.loadRoutine(routine as any);
    });

    expect(result.current.name).toBe('Rutina Cargada');
    expect(result.current.exercises).toHaveLength(1);
    expect(result.current.exercises[0].sets).toBe(5);
  });

  it('resetea el estado', () => {
    const { result } = renderHook(() => useRoutineEditor());
    
    act(() => {
      result.current.setName('Temp');
      result.current.reset();
    });
    
    expect(result.current.name).toBe('');
  });
});

