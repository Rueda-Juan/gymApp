import { mapPrimaryMuscle, mapSecondaryMuscles, mapEquipment, getAnatomicalSvgUrl } from '../wgerMapper';

describe('wgerMapper', () => {
  describe('mapPrimaryMuscle', () => {
    it('maps an existing wger muscle ID to GymApp domain', () => {
      // 4 is Pectoralis major -> chest
      const result = mapPrimaryMuscle([4]);
      expect(result.primaryMuscle).toBe('chest');
      expect(result.primaryMuscleId).toBe(4);
    });

    it('falls back to bodyweight if the muscle ID is unknown but array is somewhat populated', () => {
      const result = mapPrimaryMuscle([999]); // Unknown ID
      expect(result.primaryMuscle).toBe('bodyweight');
      expect(result.primaryMuscleId).toBe(null);
    });

    it('returns other if no muscles are provided', () => {
      const result = mapPrimaryMuscle([]);
      expect(result.primaryMuscle).toBe('other');
      expect(result.primaryMuscleId).toBe(null);
    });

    it('takes the first known muscle if multiple are provided', () => {
      // 999 unknown, 1 is biceps
      const result = mapPrimaryMuscle([999, 1, 4]);
      expect(result.primaryMuscle).toBe('biceps');
      expect(result.primaryMuscleId).toBe(1);
    });
  });

  describe('mapSecondaryMuscles', () => {
    it('maps multiple secondary muscles uniquely', () => {
      // 1 (biceps), 13 (biceps), 5 (triceps) -> ['biceps', 'triceps']
      const result = mapSecondaryMuscles([1, 13, 5]);
      expect(result).toEqual(['biceps', 'triceps']);
    });

    it('ignores unknown secondary muscles', () => {
      const result = mapSecondaryMuscles([1, 999]);
      expect(result).toEqual(['biceps']);
    });

    it('returns empty array if nothing is passed', () => {
      expect(mapSecondaryMuscles([])).toEqual([]);
    });
  });

  describe('mapEquipment', () => {
    it('maps an existing wger equipment ID to GymApp domain', () => {
      // 3 is Dumbbell -> dumbbell
      const eq = mapEquipment([3]);
      expect(eq).toBe('dumbbell');
    });

    it('returns other if no equipment matches', () => {
      const eq = mapEquipment([999]);
      expect(eq).toBe('other');
    });

    it('prioritizes the first matching equipment', () => {
      // 3 (Dumbbell), 1 (Barbell) -> 'dumbbell'
      const eq = mapEquipment([3, 1]);
      expect(eq).toBe('dumbbell');
    });
  });

  describe('getAnatomicalSvgUrl', () => {
    it('returns the wger URL correctly populated for a given primary muscle ID', () => {
      const result = getAnatomicalSvgUrl(4);
      expect(result).toBe('https://wger.de/static/images/muscles/main/muscle-4.svg');
    });

    it('returns null if primaryMuscleId is null', () => {
      const result = getAnatomicalSvgUrl(null);
      expect(result).toBeNull();
    });
  });
});
