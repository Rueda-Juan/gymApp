import { Platform } from 'react-native';

// ─────────────────────────────────────────────
// ELEVATION TOKENS — Temper Design System
// Centraliza todas las propiedades de sombra.
// Usar estos objetos (spread) en vez de definir
// shadowRadius, shadowOpacity, etc. individualmente.
//
// Reglas de uso:
//   flat     → elementos inline, tarjetas con borde
//   card     → CardBase variant default
//   floating → mini-player, FAB, chips flotantes
//   modal    → bottom sheets, modales, overlays
// ─────────────────────────────────────────────

const SHADOW_COLOR = '#000000';

export const elevation = {
  flat: {
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },

  card: {
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: Platform.OS === 'android' ? 2 : 0,
  },

  floating: {
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: Platform.OS === 'android' ? 6 : 0,
  },

  modal: {
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: Platform.OS === 'android' ? 12 : 0,
  },
} as const;

/**
 * Style object for Animated.View wrappers around CardBase.
 * Moves the shadow to the animated layer so opacity transitions
 * don't cause a flash of the shadow before the card content appears.
 * Usage: <Animated.View style={animatedCardShadow} entering={...}>
 *          <CardBase {...elevation.flat} ...>
 */
const CARD_BORDER_RADIUS = 12;

export const animatedCardShadow = {
  borderRadius: CARD_BORDER_RADIUS,
  ...elevation.card,
} as const;

export type ElevationLevel = keyof typeof elevation;
