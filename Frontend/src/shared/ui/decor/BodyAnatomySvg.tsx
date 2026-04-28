import React, { useMemo } from 'react';
import { ViewStyle, StyleProp, Appearance } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { MUSCLE_METADATA } from '../../constants/muscleMetadata';
import type { MuscleKey } from '../../constants/exercise';

export interface BodyAnatomySvgProps {
  activeMuscles?: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  style?: StyleProp<ViewStyle>;
  theme?: 'dark' | 'light';
  primaryColor?: string;
  primaryStrokeColor?: string;
  secondaryColor?: string;
  secondaryStrokeColor?: string;
  inactiveColor?: string;
  inactiveStrokeColor?: string;
}

type MusclePath = {
  id: MuscleKey;
  d: string;
  transform?: string;
};

/**
 * Paths del SVG separados por grupo muscular.
 * Cada entrada usa el `id` correspondiente al `MuscleKey` de muscleMetadata.
 *
 * TODO: Reemplazar cada `d` con el path real del SVG anatómico segmentado.
 *       El viewBox actual es 0 0 600 800 — ajustar si el SVG final difiere.
 */
const MUSCLE_PATHS: MusclePath[] = [
  { id: 'chest', d: '' },
  { id: 'upper-chest', d: '' },
  { id: 'mid-chest', d: '' },
  { id: 'lower-chest', d: '' },
  { id: 'back', d: '' },
  { id: 'lats', d: '' },
  { id: 'upper-back', d: '' },
  { id: 'mid-back', d: '' },
  { id: 'lower-back', d: '' },
  { id: 'shoulders', d: '' },
  { id: 'front-delts', d: '' },
  { id: 'side-delts', d: '' },
  { id: 'rear-delts', d: '' },
  { id: 'biceps', d: '' },
  { id: 'triceps', d: '' },
  { id: 'forearms', d: '' },
  { id: 'quadriceps', d: '' },
  { id: 'hamstrings', d: '' },
  { id: 'glutes', d: '' },
  { id: 'calves', d: '' },
  { id: 'adductors', d: '' },
  { id: 'abs', d: '' },
  { id: 'upper-abs', d: '' },
  { id: 'lower-abs', d: '' },
  { id: 'obliques', d: '' },
  { id: 'traps', d: '' },
];

const SVG_ID_ALIASES: Record<string, MuscleKey> = {
  'back-delts': 'rear-delts',
  'front-delts1': 'front-delts',
  'side-delts1': 'side-delts',
  'front-adductors': 'adductors',
  'back-adductors': 'adductors',
};

function resolveCanonicalId(rawId: string): MuscleKey {
  return SVG_ID_ALIASES[rawId] ?? (rawId as MuscleKey);
}

export function BodyAnatomySvg({
  activeMuscles = [],
  primaryMuscles,
  secondaryMuscles,
  style,
  theme,
  primaryColor,
  primaryStrokeColor,
  secondaryColor,
  secondaryStrokeColor,
  inactiveColor,
  inactiveStrokeColor,
}: BodyAnatomySvgProps) {
  const systemScheme = Appearance.getColorScheme();
  const isLight = (theme ?? systemScheme) === 'light';

  const resolvedPrimaryFill = primaryColor ?? '#D4621A';
  const resolvedPrimaryStroke = primaryStrokeColor ?? '#B8521A';
  const resolvedSecondaryFill = secondaryColor ?? '#E8B84B';
  const resolvedSecondaryStroke = secondaryStrokeColor ?? '#D4A63E';
  const resolvedInactiveFill = inactiveColor ?? (isLight ? '#D6D0C4' : '#28241C');
  const resolvedInactiveStroke = inactiveStrokeColor ?? (isLight ? '#C4BEB2' : '#3E382B');

  const primarySet = useMemo(() => primaryMuscles ?? activeMuscles, [primaryMuscles, activeMuscles]);
  const secondarySet = useMemo(() => secondaryMuscles ?? [], [secondaryMuscles]);

  const isMuscleInSet = (muscleId: MuscleKey, set: string[]): boolean => {
    if (set.includes(muscleId)) return true;

    const meta = MUSCLE_METADATA[muscleId];
    const hasActiveChild = meta?.children?.some((child) => set.includes(child)) ?? false;
    if (hasActiveChild) return true;

    if (meta?.parent && set.includes(meta.parent)) return true;

    return false;
  };

  const getFillColor = (muscleId: MuscleKey): string => {
    if (isMuscleInSet(muscleId, primarySet)) return resolvedPrimaryFill;
    if (isMuscleInSet(muscleId, secondarySet)) return resolvedSecondaryFill;
    return resolvedInactiveFill;
  };

  const getStrokeColor = (muscleId: MuscleKey): string => {
    if (isMuscleInSet(muscleId, primarySet)) return resolvedPrimaryStroke;
    if (isMuscleInSet(muscleId, secondarySet)) return resolvedSecondaryStroke;
    return resolvedInactiveStroke;
  };

  const visiblePaths = useMemo(
    () => MUSCLE_PATHS.filter(({ d }) => d.length > 0),
    []
  );

  const hasVisiblePaths = visiblePaths.length > 0;

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 600 800"
      style={style}
    >
      {hasVisiblePaths ? (
        visiblePaths.map(({ id, d, transform }) => {
          const canonicalId = resolveCanonicalId(id);
          const label = MUSCLE_METADATA[canonicalId]?.label ?? id;

          return transform ? (
            <G key={id} transform={transform}>
              <Path
                d={d}
                fill={getFillColor(canonicalId)}
                stroke={getStrokeColor(canonicalId)}
                strokeWidth={2}
                accessibilityLabel={label}
                testID={`muscle-${id}`}
              />
            </G>
          ) : (
            <Path
              key={id}
              d={d}
              fill={getFillColor(canonicalId)}
              stroke={getStrokeColor(canonicalId)}
              strokeWidth={2}
              accessibilityLabel={label}
              testID={`muscle-${id}`}
            />
          );
        })
      ) : (
        <G>
          <Rect
            x="150"
            y="200"
            width="300"
            height="400"
            rx="20"
            fill={resolvedInactiveFill}
            stroke={resolvedInactiveStroke}
            strokeWidth={2}
            opacity={0.3}
          />
        </G>
      )}
    </Svg>
  );
}

export default BodyAnatomySvg;
