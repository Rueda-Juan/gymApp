import { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

// ─────────────────────────────────────────────
// MOTION TOKENS — Temper Design System
// Todas las duraciones, configs spring, escalas
// y easings centralizados aquí. Cero magic numbers
// de animación en componentes.
// ─────────────────────────────────────────────

export const motion = {
  duration: {
    instant: 80,
    fast:    150,
    normal:  220,
    slow:    320,
    hero:    520,
  },

  spring: {
    snappy: { damping: 20, stiffness: 260, mass: 1.2 },
    heavy:  { damping: 28, stiffness: 140, mass: 1.5 },
    sheet:  { damping: 28, stiffness: 140, mass: 1.6 },
    bounce: { damping: 16, stiffness: 180, mass: 1.1 },
    subtle: { damping: 24, stiffness: 120, mass: 1.2 },
  },

  scale: {
    press: 0.95,
    micro: 1.03,
    pop:   1.08,
  },

  easing: {
    standard:   Easing.bezier(0.2, 0.0, 0.0, 1.0),
    decelerate: Easing.out(Easing.ease),
    accelerate: Easing.in(Easing.ease),
    symmetric:  Easing.inOut(Easing.ease),
  },
} as const;

// ─────────────────────────────────────────────
// SEMÁNTICA DE MOVIMIENTO — por familia cromática
// ─────────────────────────────────────────────

export const motionSemantics = {
  // Cobre — CTA, play, tabs activos, chips activos
  action: {
    spring:   motion.spring.snappy,
    duration: motion.duration.fast,
    scale:    motion.scale.press,
  },

  // Acero — rest timer, gráficos, transiciones informativas
  information: {
    spring:   motion.spring.subtle,
    duration: motion.duration.normal,
    scale:    undefined,
  },

  // Brasa — PR badge, trofeo, récord de racha
  reward: {
    spring:   motion.spring.bounce,
    duration: motion.duration.hero,
    scale:    motion.scale.pop,
  },

  // Transiciones entre ejercicios, sheets, modales
  navigation: {
    spring:   motion.spring.heavy,
    duration: motion.duration.normal,
    scale:    undefined,
  },

  // Micro-interacciones: check, toggle, swipe cancel
  feedback: {
    spring:   motion.spring.snappy,
    duration: motion.duration.instant,
    scale:    motion.scale.micro,
  },
} as const;

// ─────────────────────────────────────────────
// TIPOS DERIVADOS
// ─────────────────────────────────────────────

export type MotionDuration  = keyof typeof motion.duration;
export type SpringPreset    = keyof typeof motion.spring;
export type ScalePreset     = keyof typeof motion.scale;
export type EasingPreset    = keyof typeof motion.easing;
export type MotionSemantic  = keyof typeof motionSemantics;

// ─────────────────────────────────────────────
// REDUCED MOTION CONFIG
// Valores de fallback cuando el usuario prefiere
// animaciones reducidas (accesibilidad / rendimiento).
// ─────────────────────────────────────────────

export const reducedMotionConfig = {
  replaceSpringWithTiming:  true,
  disableHeroAnimations:    true,
  disableLayoutAnimations:  false,
  disableLoopAnimations:    true,
  maxDuration:              150,
  fallbackEntering:         FadeIn.duration(100),
  fallbackExiting:          FadeOut.duration(80),
} as const;
