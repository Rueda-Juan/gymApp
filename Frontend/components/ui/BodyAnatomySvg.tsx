import React from 'react';
import { ViewStyle, StyleProp, Appearance } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { MUSCLE_METADATA } from '../../constants/muscleMetadata';

export interface BodyAnatomySvgProps {
    // Backwards-compatible: activeMuscles used as primary set when primaryMuscles is not provided
    activeMuscles?: string[];
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    style?: StyleProp<ViewStyle>;
    theme?: 'dark' | 'light';
    color?: string;
    // Primary (highlights) — defaults depend on theme (see identity)
    primaryColor?: string;
    primaryStrokeColor?: string;
    // Secondary (worked but secondary)
    secondaryColor?: string;
    secondaryStrokeColor?: string;
    // Backwards-compatible aliases
    activeColor?: string;
    activeStrokeColor?: string;
    // Inactive/default
    inactiveColor?: string;
    inactiveStrokeColor?: string;
    // Interactivity
    interactive?: boolean;
    onSelectMuscle?: (muscle: string | null) => void;
    selectedMuscle?: string | null;
}

export function BodyAnatomySvg({ 
        activeMuscles = [],
        primaryMuscles,
        secondaryMuscles,
        style, 
        theme,
        color = '#161410', 
        // legacy props kept for backward compatibility
        activeColor,
        activeStrokeColor,
        primaryColor,
        primaryStrokeColor,
        secondaryColor,
        secondaryStrokeColor,
        inactiveColor = '#3a3a3a',
        inactiveStrokeColor = '#4a4a4a',
        interactive = false,
        onSelectMuscle,
        selectedMuscle: controlledSelectedMuscle,
}: BodyAnatomySvgProps) {
    // Selection state (controlled or uncontrolled)
    const [internalSelected, setInternalSelected] = React.useState<string | null>(null);
    const selectedMuscle = controlledSelectedMuscle !== undefined ? controlledSelectedMuscle : internalSelected;
  // Theme-aware defaults based on the app identity
  const systemScheme = Appearance.getColorScheme();
  const isLight = (theme ?? systemScheme) === 'light';

  const resolvedPrimaryFill = primaryColor ?? activeColor ?? (isLight ? '#D4621A' : '#E8762E');
  const resolvedPrimaryStroke = primaryStrokeColor ?? activeStrokeColor ?? (isLight ? '#E8762E' : '#D4621A');
  const resolvedSecondaryFill = secondaryColor ?? '#E8B84B';
  const resolvedSecondaryStroke = secondaryStrokeColor ?? '#D4882A';
  const resolvedInactiveFill = inactiveColor ?? (isLight ? '#8C8374' : '#3a3a3a');
  const resolvedInactiveStroke = inactiveStrokeColor ?? (isLight ? '#B0A899' : '#4a4a4a');

    const primarySet = primaryMuscles ?? activeMuscles ?? [];
    const secondarySet = secondaryMuscles ?? [];

    // Handle muscle selection
    const handleMusclePress = React.useCallback(
        (muscle: string | null) => {
            if (!interactive) return;
            if (onSelectMuscle) {
                onSelectMuscle(muscle);
            } else {
                setInternalSelected(muscle);
            }
        },
        [interactive, onSelectMuscle]
    );


    // Map SVG group/path ids to canonical muscle keys using muscle metadata
    const SVG_ID_MAP: Record<string, string> = {
        'back-delts': 'rear-delts',
        'front-delts1': 'front-delts',
        'side-delts1': 'side-delts',
        'lines1': 'lines',
        'front-adductors': 'adductors',
        'back-adductors': 'adductors',
        // Add more SVG id aliases as needed
    };

    const canonicalId = (id?: string | null): string | null => {
        if (!id) return null;
        return SVG_ID_MAP[id] ?? id;
    };

    // Use muscle metadata for fill/stroke logic
    const getMuscleFill = (id?: string | null) => {
        const key = canonicalId(id ?? null);
        if (!key || key === 'other') return resolvedInactiveFill;
        // Highlight if selected
        if (selectedMuscle && key === selectedMuscle) {
          return '#4B9EFF'; // Selection color (customize as needed)
        }
        if (primarySet.includes(key)) return resolvedPrimaryFill;
        if (secondarySet.includes(key)) return resolvedSecondaryFill;
        // Optionally: highlight parent if any child is selected
        const meta = MUSCLE_METADATA[key as keyof typeof MUSCLE_METADATA];
        if (meta?.children && meta.children.some(child => primarySet.includes(child))) {
            return resolvedPrimaryFill;
        }
        if (meta?.children && meta.children.some(child => secondarySet.includes(child))) {
            return resolvedSecondaryFill;
        }
        return resolvedInactiveFill;
    };

    const getMuscleStroke = (id?: string | null) => {
        const key = canonicalId(id ?? null);
        if (!key || key === 'other') return resolvedInactiveStroke;
        // Highlight if selected
        if (selectedMuscle && key === selectedMuscle) {
          return '#2563EB'; // Selection stroke color
        }
        if (primarySet.includes(key)) return resolvedPrimaryStroke;
        if (secondarySet.includes(key)) return resolvedSecondaryStroke;
        const meta = MUSCLE_METADATA[key as keyof typeof MUSCLE_METADATA];
        if (meta?.children && meta.children.some(child => primarySet.includes(child))) {
            return resolvedPrimaryStroke;
        }
        if (meta?.children && meta.children.some(child => secondarySet.includes(child))) {
            return resolvedSecondaryStroke;
        }
        return resolvedInactiveStroke;
    };


        // --- AUTO-GENERATED: All muscle paths from Body3.0.svg ---
        // --- AUTO-GENERATED: All muscle paths from Body3.0.svg ---
        type MusclePath = { id: string; label: string; d: string; transform?: string };
        const MUSCLE_PATHS: MusclePath[] = [
            // ... all muscle paths as before ...
        ];

        return (
            <Svg width="100%" height="100%" viewBox="0 0 1855 1538" style={style}>
                {/* Render all muscle paths */}
                {MUSCLE_PATHS.map(({ id, d, label, transform }) => (
                    transform ? (
                        <G key={id} transform={transform}>
                            <Path
                                d={d}
                                fill={getMuscleFill(id)}
                                stroke={getMuscleStroke(id)}
                                strokeWidth={selectedMuscle === id ? 8 : 2}
                                onPress={interactive ? () => handleMusclePress(id) : undefined}
                                accessibilityLabel={label}
                                testID={`muscle-${id}`}
                            />
                        </G>
                    ) : (
                        <Path
                            key={id}
                            d={d}
                            fill={getMuscleFill(id)}
                            stroke={getMuscleStroke(id)}
                            strokeWidth={selectedMuscle === id ? 8 : 2}
                            onPress={interactive ? () => handleMusclePress(id) : undefined}
                            accessibilityLabel={label}
                            testID={`muscle-${id}`}
                        />
                    )
                ))}
            </Svg>
        );
}