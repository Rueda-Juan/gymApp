export const MUSCLE_OPTIONS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs', 'traps',
] as const;

export const EQUIPMENT_OPTIONS = [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'band', 'other',
] as const;

type MuscleKey = typeof MUSCLE_OPTIONS[number];
type EquipmentKey = typeof EQUIPMENT_OPTIONS[number];

export const MUSCLE_LABELS: Record<MuscleKey, string> = {
  chest: 'Pecho', back: 'Espalda', shoulders: 'Hombros',
  biceps: 'Bíceps', triceps: 'Tríceps', forearms: 'Antebrazos',
  quadriceps: 'Cuádriceps', hamstrings: 'Isquiotibiales',
  glutes: 'Glúteos', calves: 'Pantorrillas', abs: 'Abdominales', traps: 'Trapecios',
};

export const EQUIPMENT_LABELS: Record<EquipmentKey, string> = {
  barbell: 'Barra', dumbbell: 'Mancuernas', machine: 'Máquina',
  cable: 'Cable', bodyweight: 'Peso corporal', band: 'Banda', other: 'Otro',
};

const MUSCLE_ICON_MAP: Partial<Record<MuscleKey, string>> = {
  biceps: 'arm-flex', triceps: 'arm-flex', forearms: 'arm-flex',
  quadriceps: 'run', hamstrings: 'run', calves: 'run', glutes: 'run',
  chest: 'human', abs: 'human',
  back: 'human-handsup', shoulders: 'human-handsup', traps: 'human-handsup',
};

const DEFAULT_MUSCLE_ICON = 'dumbbell';

// Separate string-keyed view for safe runtime lookups with arbitrary strings.
// The typed MUSCLE_ICON_MAP above still enforces completeness at declaration.
const MUSCLE_ICON_LOOKUP: Record<string, string | undefined> = MUSCLE_ICON_MAP;

export const getMuscleIconName = (muscle?: string): string =>
  MUSCLE_ICON_LOOKUP[muscle?.toLowerCase() ?? ''] ?? DEFAULT_MUSCLE_ICON;
