export const MUSCLE_OPTIONS = [
  'chest', 'upper-chest', 'mid-chest', 'lower-chest',
  'back', 'lats', 'upper-back', 'mid-back', 'lower-back',
  'shoulders', 'front-delts', 'side-delts', 'rear-delts',
  'biceps', 'triceps', 'forearms',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors',
  'abs', 'upper-abs', 'lower-abs', 'obliques',
  'traps',
] as const;

export const EQUIPMENT_OPTIONS = [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'band', 'other',
] as const;

export type MuscleKey = typeof MUSCLE_OPTIONS[number];
export type EquipmentKey = typeof EQUIPMENT_OPTIONS[number];

export const MUSCLE_LABELS: Record<MuscleKey, string> = {
  chest: 'Pecho',
  'upper-chest': 'Pecho Superior',
  'mid-chest': 'Pecho Medio',
  'lower-chest': 'Pecho Inferior',
  back: 'Espalda',
  lats: 'Dorsales',
  'upper-back': 'Espalda Alta',
  'mid-back': 'Espalda Media',
  'lower-back': 'Espalda Baja',
  shoulders: 'Hombros',
  'front-delts': 'Deltoides Frontal',
  'side-delts': 'Deltoides Lateral',
  'rear-delts': 'Deltoides Posterior',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  forearms: 'Antebrazos',
  quadriceps: 'Cuádriceps',
  hamstrings: 'Isquiotibiales',
  glutes: 'Glúteos',
  calves: 'Pantorrillas',
  adductors: 'Aductores',
  abs: 'Abdominales',
  'upper-abs': 'Abdominales Superiores',
  'lower-abs': 'Abdominales Inferiores',
  obliques: 'Oblicuos',
  traps: 'Trapecios',
};

export const EQUIPMENT_LABELS: Record<EquipmentKey, string> = {
  barbell: 'Barra', dumbbell: 'Mancuernas', machine: 'Máquina',
  cable: 'Cable', bodyweight: 'Peso corporal', band: 'Banda', other: 'Otro',
};

const MUSCLE_ICON_MAP: Partial<Record<MuscleKey, string>> = {
  biceps: 'arm-flex', triceps: 'arm-flex', forearms: 'arm-flex',
  quadriceps: 'run', hamstrings: 'run', calves: 'run', glutes: 'run', adductors: 'run',
  chest: 'human', abs: 'human', 'upper-abs': 'human', 'lower-abs': 'human', obliques: 'human', 'upper-chest': 'human', 'mid-chest': 'human', 'lower-chest': 'human',
  back: 'human-handsup', shoulders: 'human-handsup', traps: 'human-handsup', lats: 'human-handsup', 'upper-back': 'human-handsup', 'mid-back': 'human-handsup', 'lower-back': 'human-handsup', 'front-delts': 'human-handsup', 'side-delts': 'human-handsup', 'rear-delts': 'human-handsup',
};

const DEFAULT_MUSCLE_ICON = 'dumbbell';

// Separate string-keyed view for safe runtime lookups with arbitrary strings.
// The typed MUSCLE_ICON_MAP above still enforces completeness at declaration.
const MUSCLE_ICON_LOOKUP: Record<string, string | undefined> = MUSCLE_ICON_MAP;

export const getMuscleIconName = (muscle?: string): string =>
  MUSCLE_ICON_LOOKUP[muscle?.toLowerCase() ?? ''] ?? DEFAULT_MUSCLE_ICON;

export const HIERARCHICAL_MUSCLES: { category: MuscleKey; subdivisions?: MuscleKey[] }[] = [
  { category: 'chest', subdivisions: ['upper-chest', 'mid-chest', 'lower-chest'] },
  { category: 'back', subdivisions: ['lats', 'upper-back', 'mid-back', 'lower-back'] },
  { category: 'shoulders', subdivisions: ['front-delts', 'side-delts', 'rear-delts'] },
  { category: 'biceps' },
  { category: 'triceps' },
  { category: 'forearms' },
  { category: 'quadriceps' },
  { category: 'hamstrings' },
  { category: 'glutes' },
  { category: 'calves' },
  { category: 'adductors' },
  { category: 'abs', subdivisions: ['upper-abs', 'lower-abs', 'obliques'] },
  { category: 'traps' },
];
