import { BaseAnimationBuilder, EntryExitAnimationFunction, Keyframe } from 'react-native-reanimated';
import { useMotionPreference } from '../../ui/context/MotionContext';
import { motion, motionSemantics, reducedMotionConfig } from '../../constants/motion';

type AnimationBuilder = BaseAnimationBuilder | EntryExitAnimationFunction | Keyframe;

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

    entering<T extends AnimationBuilder>(animation: T): T {
      if (isReduced) return (reducedMotionConfig.fallbackEntering as unknown) as T;
      return animation;
    },

    exiting<T extends AnimationBuilder>(animation: T): T {
      if (isReduced) return (reducedMotionConfig.fallbackExiting as unknown) as T;
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

