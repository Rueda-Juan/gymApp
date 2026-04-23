import { renderHook } from '@testing-library/react-native';
import { useRoutineApi } from '@/shared/api';
import { useDI } from '@/shared/context/DIContext';

// Mock DI
jest.mock('@/shared/context/DIContext', () => ({
  useDI: jest.fn(),
}));

describe('useRoutines', () => {
  const mockRoutines = [{ id: '1', name: 'R1' }];
  const mockDI = {
    createRoutine: { execute: jest.fn() },
    updateRoutine: { execute: jest.fn() },
    deleteRoutine: { execute: jest.fn() },
    duplicateRoutine: { execute: jest.fn() },
    getRoutines: { execute: jest.fn(() => Promise.resolve(mockRoutines)) },
    getRoutineById: { execute: jest.fn() },
    getExercises: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDI as jest.Mock).mockReturnValue(mockDI);
  });

  it('delega getRoutines al servicio correspondiente', async () => {
    const { result } = renderHook(() => useRoutineApi());
    const routines = await result.current.getRoutines();
    
    expect(mockDI.getRoutines.execute).toHaveBeenCalled();
    expect(routines).toEqual(mockRoutines);
  });

  it('delega createRoutine al servicio correspondiente', async () => {
    const { result } = renderHook(() => useRoutineApi());
    const params = { name: 'New' } as any;
    
    await result.current.createRoutine(params);
    expect(mockDI.createRoutine.execute).toHaveBeenCalledWith(params);
  });

  it('delega deleteRoutine al servicio correspondiente', async () => {
    const { result } = renderHook(() => useRoutineApi());
    
    await result.current.deleteRoutine('123');
    expect(mockDI.deleteRoutine.execute).toHaveBeenCalledWith('123');
  });

  it('delega duplicateRoutine al servicio correspondiente', async () => {
    const { result } = renderHook(() => useRoutineApi());
    
    await result.current.duplicateRoutine('123');
    expect(mockDI.duplicateRoutine.execute).toHaveBeenCalledWith('123');
  });
});
