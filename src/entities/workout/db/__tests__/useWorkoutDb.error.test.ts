import { renderHook } from '@testing-library/react-native';
import { useWorkoutDb } from '../useWorkoutDb';
import { db } from '@/db/connection';

// Mocks
jest.mock('@/db/connection', () => ({
  db: {
    insert: jest.fn(),
    transaction: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    run: jest.fn(),
  },
}));

describe('useWorkoutDb - Error Scenarios', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should propagate error when startWorkout fails (e.g. disk full)', async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockRejectedValue(new Error('SQLITE_FULL: database or disk is full')),
    });

    const { result } = renderHook(() => useWorkoutDb());
    
    await expect(result.current.startWorkout()).rejects.toThrow('SQLITE_FULL');
  });

  it('should propagate error when recordAllSets transaction fails', async () => {
    (db.transaction as jest.Mock).mockRejectedValue(new Error('database is locked'));

    const { result } = renderHook(() => useWorkoutDb());
    
    await expect(result.current.recordAllSets('w-1', [])).rejects.toThrow('database is locked');
  });

  it('should propagate error when finishWorkout fails', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockRejectedValue(new Error('Constraint failed')),
      }),
    });

    const { result } = renderHook(() => useWorkoutDb());
    
    await expect(result.current.finishWorkout('w-1', 'notes')).rejects.toThrow('Constraint failed');
  });
});
