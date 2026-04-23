import { useMotionPreference } from '../../ui/context/MotionContext';
import { motion, motionSemantics, reducedMotionConfig } from '../../constants/motion';

export function useMotion() {
  const { isReduced } = useMotionPreference();

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

    entering(animation: any): any {
      if (isReduced) return reducedMotionConfig.fallbackEntering;
      return animation;
    },

    exiting(animation: any): any {
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

