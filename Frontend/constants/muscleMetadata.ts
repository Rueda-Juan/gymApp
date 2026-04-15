import { MuscleKey } from './exercise';

/**
 * Hierarchical, strictly typed muscle metadata for scalable SVG muscle selector and stats.
 */
export interface MuscleMetadata {
  key: MuscleKey;
  label: string;
  parent?: MuscleKey;
  children?: MuscleKey[];
  svgId?: string; // SVG group/path id for hit-testing
  isSelectable?: boolean; // For future: allow disabling selection
  // Add more fields as needed (e.g., stats, color, etc.)
}

// Flat map for fast lookup
export const MUSCLE_METADATA: Record<MuscleKey, MuscleMetadata> = {
  chest: {
    key: 'chest', label: 'Pecho', children: ['upper-chest', 'mid-chest', 'lower-chest'], svgId: 'chest',
  },
  'upper-chest': {
    key: 'upper-chest', label: 'Pecho Superior', parent: 'chest', svgId: 'upper-chest',
  },
  'mid-chest': {
    key: 'mid-chest', label: 'Pecho Medio', parent: 'chest', svgId: 'mid-chest',
  },
  'lower-chest': {
    key: 'lower-chest', label: 'Pecho Inferior', parent: 'chest', svgId: 'lower-chest',
  },
  back: {
    key: 'back', label: 'Espalda', children: ['lats', 'upper-back', 'mid-back', 'lower-back'], svgId: 'back',
  },
  lats: {
    key: 'lats', label: 'Dorsales', parent: 'back', svgId: 'lats',
  },
  'upper-back': {
    key: 'upper-back', label: 'Espalda Alta', parent: 'back', svgId: 'upper-back',
  },
  'mid-back': {
    key: 'mid-back', label: 'Espalda Media', parent: 'back', svgId: 'mid-back',
  },
  'lower-back': {
    key: 'lower-back', label: 'Espalda Baja', parent: 'back', svgId: 'lower-back',
  },
  shoulders: {
    key: 'shoulders', label: 'Hombros', children: ['front-delts', 'side-delts', 'rear-delts'], svgId: 'shoulders',
  },
  'front-delts': {
    key: 'front-delts', label: 'Deltoides Frontal', parent: 'shoulders', svgId: 'front-delts',
  },
  'side-delts': {
    key: 'side-delts', label: 'Deltoides Lateral', parent: 'shoulders', svgId: 'side-delts',
  },
  'rear-delts': {
    key: 'rear-delts', label: 'Deltoides Posterior', parent: 'shoulders', svgId: 'rear-delts',
  },
  biceps: {
    key: 'biceps', label: 'Bíceps', svgId: 'biceps',
  },
  triceps: {
    key: 'triceps', label: 'Tríceps', svgId: 'triceps',
  },
  forearms: {
    key: 'forearms', label: 'Antebrazos', svgId: 'forearms',
  },
  quadriceps: {
    key: 'quadriceps', label: 'Cuádriceps', svgId: 'quadriceps',
  },
  hamstrings: {
    key: 'hamstrings', label: 'Isquiotibiales', svgId: 'hamstrings',
  },
  glutes: {
    key: 'glutes', label: 'Glúteos', svgId: 'glutes',
  },
  calves: {
    key: 'calves', label: 'Pantorrillas', svgId: 'calves',
  },
  adductors: {
    key: 'adductors', label: 'Aductores', svgId: 'adductors',
  },
  abs: {
    key: 'abs', label: 'Abdominales', children: ['upper-abs', 'lower-abs', 'obliques'], svgId: 'abs',
  },
  'upper-abs': {
    key: 'upper-abs', label: 'Abdominales Superiores', parent: 'abs', svgId: 'upper-abs',
  },
  'lower-abs': {
    key: 'lower-abs', label: 'Abdominales Inferiores', parent: 'abs', svgId: 'lower-abs',
  },
  obliques: {
    key: 'obliques', label: 'Oblicuos', parent: 'abs', svgId: 'obliques',
  },
  traps: {
    key: 'traps', label: 'Trapecios', svgId: 'traps',
  },
};

export const getMuscleMetadata = (key: MuscleKey): MuscleMetadata => MUSCLE_METADATA[key];
