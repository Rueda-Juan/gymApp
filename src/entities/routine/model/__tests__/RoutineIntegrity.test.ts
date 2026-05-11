import { renderHook } from '@testing-library/react-native';
import { useRoutineDb } from '@/entities/routine';
import { db } from '@/db/connection';

// Mock DB
jest.mock('@/db/connection', () => ({
  db: {
    query: {
      routines: {
        findFirst: jest.fn(),
      },
    },
  },
}));

describe('Routine Referential Integrity', () => {
  it('should handle routine with a missing exercise gracefully', async () => {
    // Simulate a routine where one routineExercise has a null exercise (broken link)
    (db.query.routines.findFirst as jest.Mock).mockResolvedValue({
      id: 'r-1',
      name: 'Broken Routine',
      routineExercises: [
        {
          id: 're-1',
          exerciseId: 'deleted-ex',
          exercise: null, // Missing join result
        }
      ],
    });

    const { result } = renderHook(() => useRoutineDb());
    const routine = await result.current.getRoutineById('r-1');

    expect(routine).toBeDefined();
    expect(routine?.routineExercises[0].exercise).toBeNull();
  });
});
