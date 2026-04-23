import React, { useMemo } from 'react';
import Svg, { G, Path } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';
import { useTheme } from 'tamagui';
import type { MuscleGroup } from '@kernel';
import { 
  FRONT_SILHOUETTE_PATHS, 
  FRONT_LINE_PATHS, 
  BACK_SILHOUETTE_PATHS, 
  BACK_LINE_PATHS,
  MUSCLE_PATHS,
  MusclePathMap 
} from '../lib/musclePaths';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface MusclePathsProps {
  paths: string[];
  targetFill: string;
  targetStroke: string;
  onPress?: () => void;
}

const MuscleGroupNode: React.FC<MusclePathsProps> = ({ paths, targetFill, targetStroke, onPress }) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      fill: withTiming(targetFill, { duration: 300 }),
      stroke: withTiming(targetStroke, { duration: 300 }),
    };
  }, [targetFill, targetStroke]);

  return (
    <G onPress={onPress}>
      {(paths as string[]).map((d: string, i: number) => (
        <AnimatedPath 
          key={i} 
          d={d} 
          animatedProps={animatedProps} 
          strokeWidth={0.5} 
        />
      ))}
    </G>
  );
};

export interface BodyAnatomySvgProps {
  viewType?: 'front' | 'back' | 'both';
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  theme?: 'light' | 'dark' | null;
  primaryColor?: string;
  primaryStrokeColor?: string;
  secondaryColor?: string;
  secondaryStrokeColor?: string;
  inactiveColor?: string;
  inactiveStrokeColor?: string;
  activeMuscles?: MuscleGroup[]; // Legacy support or direct highlight
  onPressMuscle?: (muscle: MuscleGroup) => void;
}

export function BodyAnatomySvg({
  viewType = 'both',
  primaryMuscles = [],
  secondaryMuscles = [],
  theme: themeOverride,
  primaryColor,
  primaryStrokeColor,
  secondaryColor,
  secondaryStrokeColor,
  inactiveColor,
  inactiveStrokeColor,
  activeMuscles = [],
  onPressMuscle,
}: BodyAnatomySvgProps) {
  const theme = useTheme();
  
  // Design Tokens from Identidad-App.md via Tamagui Theme
  const resolvedPrimaryFill = primaryColor ?? theme.primary?.val ?? '#E8762E';
  const resolvedPrimaryStroke = primaryStrokeColor ?? theme.primaryDark?.val ?? '#D4621A';
  const resolvedSecondaryFill = secondaryColor ?? theme.info?.val ?? '#4F80B8';
  const resolvedSecondaryStroke = secondaryStrokeColor ?? theme.infoSubtle?.val ?? 'rgba(79, 128, 184, 0.2)';
  
  // Base background for muscles when not active
  const resolvedInactiveFill = inactiveColor ?? theme.surfaceSecondary?.val ?? '#1E1B16';
  const resolvedInactiveStroke = inactiveStrokeColor ?? theme.borderColor?.val ?? 'rgba(255, 255, 255, 0.1)';
  
  // Silhouette and line details
  const silhouetteFill = theme.surface?.val ?? '#161410';
  const lineStroke = theme.textTertiary?.val ?? '#6B6352';

  const primarySet = useMemo(() => new Set([...primaryMuscles, ...activeMuscles]), [primaryMuscles, activeMuscles]);
  const secondarySet = useMemo(() => new Set(secondaryMuscles), [secondaryMuscles]);

  const currentViewBox = useMemo(() => {
    if (viewType === 'front') return '0 0 314 556';
    if (viewType === 'back') return '314 0 314 556';
    return '0 0 628 556';
  }, [viewType]);

  const renderMuscleGroups = (filter: 'front' | 'back') => {
    return Object.entries(MUSCLE_PATHS as MusclePathMap).map(([muscle, paths]) => {
      const muscleKey = muscle as MuscleGroup;
      
      // Determine if front or back (heuristically or by path coordinate range if needed, 
      // but here we just render all relevant to the view)
      // Since MUSCLE_PATHS contains all paths for a group, we just render them. 
      // Svg clipping or viewBox will handle visibility if they are outside viewport.
      
      let targetFill = resolvedInactiveFill;
      let targetStroke = resolvedInactiveStroke;

      if (primarySet.has(muscleKey)) {
        targetFill = resolvedPrimaryFill;
        targetStroke = resolvedPrimaryStroke;
      } else if (secondarySet.has(muscleKey)) {
        targetFill = resolvedSecondaryFill;
        targetStroke = resolvedSecondaryStroke;
      }

      return (
        <MuscleGroupNode 
          key={muscleKey} 
          paths={paths} 
          targetFill={targetFill} 
          targetStroke={targetStroke} 
          onPress={() => onPressMuscle?.(muscleKey)}
        />
      );
    });
  };

  return (
    <Svg width="100%" height="100%" viewBox={currentViewBox}>
      <G id="anatomy-body">
        {/* Front View */}
        {(viewType === 'front' || viewType === 'both') && (
          <G id="front-view">
            <G id="front-silhouette">
              {FRONT_SILHOUETTE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} fill={silhouetteFill} pointerEvents="none" />
              ))}
            </G>
            <G id="front-muscles">
              {renderMuscleGroups('front')}
            </G>
            <G id="front-lines">
              {FRONT_LINE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} stroke={lineStroke} strokeWidth={0.5} fill="none" pointerEvents="none" />
              ))}
            </G>
          </G>
        )}

        {/* Back View */}
        {(viewType === 'back' || viewType === 'both') && (
          <G id="back-view">
            <G id="back-silhouette">
              {BACK_SILHOUETTE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} fill={silhouetteFill} pointerEvents="none" />
              ))}
            </G>
            <G id="back-muscles">
              {renderMuscleGroups('back')}
            </G>
            <G id="back-lines">
              {BACK_LINE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} stroke={lineStroke} strokeWidth={0.5} fill="none" pointerEvents="none" />
              ))}
            </G>
          </G>
        )}
      </G>
    </Svg>
  );
}
