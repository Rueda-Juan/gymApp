import { Easing } from 'react-native-reanimated';


// Motion design tokens
export const MOTION = {
  micro: 100,
  standard: 220,
  screen: 280,
  sheet: 320,
  hero: 500,
  
  // Transition presets
  spring: {
    gentle: { damping: 20, stiffness: 100 },
    snappy: { damping: 15, stiffness: 150 },
    bouncy: { damping: 10, stiffness: 180 },
    bounce: { damping: 12, stiffness: 120 },
    subtle: { damping: 25, stiffness: 80 },
  },
  
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    hero: 500,
  },
  
  easing: {
    standard: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerate: Easing.out(Easing.cubic),
    accelerate: Easing.in(Easing.cubic),
    symmetric: Easing.inOut(Easing.quad),
  },
  
  scale: {
    micro: 1.02,
    press: 0.96,
    hover: 1.02,
    pop: 1.08,
  },
  
  // Semantic durations used in UI
  fastest: 100,
  fast: 200,
  medium: 300,
  slow: 500,
};

export const motion = MOTION;

export const reducedMotionConfig = {
  maxDuration: 100,
  fallbackEntering: { duration: 100 },
  fallbackExiting: { duration: 100 },
};

export const motionSemantics = {
  card: { spring: MOTION.spring.gentle, scale: MOTION.scale.press },
  button: { spring: MOTION.spring.snappy, scale: MOTION.scale.press },
};

export default MOTION;
