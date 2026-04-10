import { useReducedMotion } from 'react-native-reanimated';
import type { BaseAnimationBuilder } from 'react-native-reanimated';
import { useSettings } from '@/store/useSettings';
import { motion, motionSemantics, reducedMotionConfig } from '@/constants/motion';

export type MotionPreference = 'system' | 'full' | 'reduced';

export function useMotion() {
  const systemReducedMotion = useReducedMotion();
  const preference = useSettings(s => s.motionPreference);

  const isReduced =
    preference === 'reduced' ||
    (preference === 'system' && systemReducedMotion);

  return {
    isReduced,

    timing(duration: number, config?: object) {
      const effectiveDuration = isReduced
        ? Math.min(duration, reducedMotionConfig.maxDuration)
        : duration;
      return { duration: effectiveDuration, ...config };
    },

    spring(preset: keyof typeof motion.spring) {
      if (isReduced) {
        return { duration: reducedMotionConfig.maxDuration };
      }
      return motion.spring[preset];
    },

    entering(animation: BaseAnimationBuilder): BaseAnimationBuilder {
      if (isReduced) return reducedMotionConfig.fallbackEntering;
      return animation;
    },

    exiting(animation: BaseAnimationBuilder): BaseAnimationBuilder {
      if (isReduced) return reducedMotionConfig.fallbackExiting;
      return animation;
    },

    semantic(type: keyof typeof motionSemantics) {
      if (isReduced) {
        return {
          spring: { duration: reducedMotionConfig.maxDuration },
          duration: reducedMotionConfig.maxDuration,
          scale: undefined,
        };
      }
      return motionSemantics[type];
    },
  };
}
