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
  
  // Design Tokens
  const resolvedPrimaryFill = primaryColor ?? theme.primary?.val ?? '#E8762E';
  const resolvedPrimaryStroke = primaryStrokeColor ?? theme.primaryDark?.val ?? '#D4621A';
  const resolvedSecondaryFill = secondaryColor ?? theme.info?.val ?? '#4F80B8';
  const resolvedSecondaryStroke = secondaryStrokeColor ?? theme.infoSubtle?.val ?? 'rgba(79, 128, 184, 0.2)';
  const resolvedInactiveFill = inactiveColor ?? theme.surfaceSecondary?.val ?? '#1E1B16';
  const resolvedInactiveStroke = inactiveStrokeColor ?? theme.borderColor?.val ?? 'rgba(255, 255, 255, 0.1)';
  const silhouetteFill = theme.surfaceTertiary?.val ?? '#28241C'; 
  const silhouetteStroke = theme.borderColor?.val ?? 'rgba(255, 255, 255, 0.2)';
  const lineStroke = theme.textTertiary?.val ?? '#6B6352';

  const primarySet = useMemo(() => new Set([...primaryMuscles, ...activeMuscles]), [primaryMuscles, activeMuscles]);
  const secondarySet = useMemo(() => new Set(secondaryMuscles), [secondaryMuscles]);

  const currentViewBox = useMemo(() => {
    if (viewType === 'front') return '0 0 314 556';
    if (viewType === 'back') return '314 0 314 556';
    return '0 0 628 556';
  }, [viewType]);

  /**
   * Consolidate all paths to handle duplicates and overlapping muscle groups.
   * A path is rendered with the highest priority found among all muscle groups it belongs to.
   * Priority: Primary > Secondary > Inactive
   */
  const pathData = useMemo(() => {
    const frontPaths = new Map<string, { fill: string; stroke: string; muscle: MuscleGroup }>();
    const backPaths = new Map<string, { fill: string; stroke: string; muscle: MuscleGroup }>();

    Object.entries(MUSCLE_PATHS as MusclePathMap).forEach(([muscle, paths]) => {
      const muscleKey = muscle as MuscleGroup;
      
      let priority = 0; // 0: inactive, 1: secondary, 2: primary
      let fill = resolvedInactiveFill;
      let stroke = resolvedInactiveStroke;

      if (primarySet.has(muscleKey)) {
        priority = 2;
        fill = resolvedPrimaryFill;
        stroke = resolvedPrimaryStroke;
      } else if (secondarySet.has(muscleKey)) {
        priority = 1;
        fill = resolvedSecondaryFill;
        stroke = resolvedSecondaryStroke;
      }

      paths?.forEach(path => {
        // Determine if front or back (heuristically)
        const firstCoordMatch = path.match(/[ML]\s*([\d.]+)/);
        const isBack = firstCoordMatch ? parseFloat(firstCoordMatch[1]) >= 314 : false;
        const targetMap = isBack ? backPaths : frontPaths;

        const existing = targetMap.get(path);
        const existingPriority = existing ? (
          primarySet.has(existing.muscle) ? 2 : 
          secondarySet.has(existing.muscle) ? 1 : 0
        ) : -1;

        if (priority > existingPriority) {
          targetMap.set(path, { fill, stroke, muscle: muscleKey });
        }
      });
    });

    return { frontPaths, backPaths };
  }, [primarySet, secondarySet, resolvedPrimaryFill, resolvedSecondaryFill, resolvedInactiveFill]);

  const renderConsolidatedPaths = (filter: 'front' | 'back') => {
    const pathsMap = filter === 'front' ? pathData.frontPaths : pathData.backPaths;
    
    // Group by fill/stroke to potentially reduce component count if needed,
    // but here we just render them. Since they are already filtered by priority,
    // we just need to render each unique path once.
    return Array.from(pathsMap.entries()).map(([path, data], index) => {
      // Note: we lose the "group" animation for shared paths if we render them individually,
      // but it fixes the coloring bug perfectly.
      return (
        <MuscleGroupNode 
          key={`${filter}-${index}`} 
          paths={[path]} 
          targetFill={data.fill} 
          targetStroke={data.stroke} 
          onPress={() => onPressMuscle?.(data.muscle)}
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
                <Path key={i} d={d} fill={silhouetteFill} stroke={silhouetteStroke} strokeWidth={0.5} pointerEvents="none" />
              ))}
            </G>
            <G id="front-muscles">
              {renderConsolidatedPaths('front')}
            </G>
            <G id="front-lines">
              {FRONT_LINE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} stroke={lineStroke} strokeWidth={0.4} fill="none" pointerEvents="none" opacity={0.6} />
              ))}
            </G>
          </G>
        )}

        {/* Back View */}
        {(viewType === 'back' || viewType === 'both') && (
          <G id="back-view">
            <G id="back-silhouette">
              {BACK_SILHOUETTE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} fill={silhouetteFill} stroke={silhouetteStroke} strokeWidth={0.5} pointerEvents="none" />
              ))}
            </G>
            <G id="back-muscles">
              {renderConsolidatedPaths('back')}
            </G>
            <G id="back-lines">
              {BACK_LINE_PATHS.map((d: string, i: number) => (
                <Path key={i} d={d} stroke={lineStroke} strokeWidth={0.4} fill="none" pointerEvents="none" opacity={0.6} />
              ))}
            </G>
          </G>
        )}
      </G>
    </Svg>
  );
}



