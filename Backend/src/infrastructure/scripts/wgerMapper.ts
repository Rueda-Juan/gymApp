export const MUSCLE_MAP: Record<number, string> = {
  1: 'biceps',       // Biceps brachii
  2: 'shoulders',    // Anterior deltoid
  3: 'chest',        // Serratus anterior
  4: 'chest',        // Pectoralis major
  5: 'triceps',      // Triceps brachii
  6: 'abs',          // Rectus abdominis
  7: 'calves',       // Gastrocnemius
  8: 'glutes',       // Gluteus maximus
  9: 'traps',        // Trapezius
  10: 'quadriceps',  // Quadriceps femoris
  11: 'hamstrings',  // Biceps femoris
  12: 'back',        // Latissimus dorsi
  13: 'biceps',      // Brachialis
  14: 'abs',         // Obliquus externus abdominis
  15: 'calves',      // Soleus
  16: 'back',        // Erector spinae
};

export const EQUIPMENT_MAP: Record<number, string> = {
  1: 'barbell',      // Barbell
  2: 'barbell',      // SZ-Bar
  3: 'dumbbell',     // Dumbbell
  4: 'bodyweight',   // Gym mat
  5: 'other',        // Swiss Ball
  6: 'bodyweight',   // Pull-up bar
  7: 'bodyweight',   // none
  8: 'bodyweight',   // Bench
  9: 'bodyweight',   // Incline bench
  10: 'dumbbell',    // Kettlebell
  11: 'band',        // Resistance band
};

export const SVG_BASE_URL = 'https://wger.de/static/images/muscles/main/muscle-';

export function mapPrimaryMuscle(rawPrimaryMuscles: number[]): { primaryMuscle: string, primaryMuscleId: number | null } {
  let primaryMuscle = 'other';
  let primaryMuscleId: number | null = null;
  for (const mId of rawPrimaryMuscles) {
    if (MUSCLE_MAP[mId]) {
      primaryMuscle = MUSCLE_MAP[mId];
      primaryMuscleId = mId;
      break;
    }
  }
  if (primaryMuscle === 'other' && rawPrimaryMuscles.length > 0) {
    primaryMuscle = 'bodyweight'; // Generic fallback instead of 'other' if we don't know the muscle
  }
  return { primaryMuscle, primaryMuscleId };
}

export function mapSecondaryMuscles(rawSecondaryMuscles: number[]): string[] {
  const secondaryMusclesSet = new Set<string>();
  for (const mId of rawSecondaryMuscles) {
    if (MUSCLE_MAP[mId]) secondaryMusclesSet.add(MUSCLE_MAP[mId]);
  }
  return Array.from(secondaryMusclesSet);
}

export function mapEquipment(rawEquipment: number[]): string {
  let equipmentStr = 'other';
  for (const eqId of rawEquipment) {
    if (EQUIPMENT_MAP[eqId]) {
      equipmentStr = EQUIPMENT_MAP[eqId];
      break;
    }
  }
  return equipmentStr;
}

export function getAnatomicalSvgUrl(primaryMuscleId: number | null): string | null {
  return primaryMuscleId ? SVG_BASE_URL + primaryMuscleId + '.svg' : null;
}
