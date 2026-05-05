// ─────────────────────────────────────────────
// INTERACTION STATE TOKENS — Temper Design System
// Estados de interacción usando exclusivamente
// tokens de tema. Cero valores hex aquí.
// ─────────────────────────────────────────────

export const interactionStates = {
  pressed: {
    backgroundColor: '$surfaceTertiary',
    opacity: 0.9,
  },

  selected: {
    backgroundColor: '$surfaceTertiary',
    borderWidth: 1,
    borderColor: '$borderColor',
  },

  activeRow: {
    backgroundColor: '$surfaceTertiary',
  },

  disabled: {
    opacity: 0.4,
    pointerEvents: 'none' as const,
  },
} as const;

export type InteractionState = keyof typeof interactionStates;
