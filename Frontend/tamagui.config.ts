import { createTamagui, createTokens, createFont } from '@tamagui/core';

// ─────────────────────────────────────────────
// TEMPER — Sistema de diseño v2
// Identidad: Carbón forjado + Cobre + Brasa
// ─────────────────────────────────────────────

const systemFont = createFont({
  family: 'System',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 30,
  },
  lineHeight: {
    // lineHeight siempre >= fontSize * 1.2
    1: 16,
    2: 20,
    3: 22,
    4: 24,
    5: 26,
    6: 30,
    7: 38,
  },
  weight: {
    4: '400',
    5: '500',
    6: '600',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    5: 0,
    6: -0.5,
    7: -0.5,
  },
});

// ─────────────────────────────────────────────
// PALETA DE COLORES — tokens primitivos
// Todos los valores hex viven aquí. Los temas
// referencian estas claves; cero hex en temas.
// ─────────────────────────────────────────────
const tokens = createTokens({
  color: {
    transparent: '#ffffff00',
    white: '#FFFFFF',
    black: '#000000',

    // ── CARBÓN — grises cálidos (~2700K) ──
    coal950: '#0D0C0A',    // bg dark principal
    coal900: '#161410',    // surface dark
    coal850: '#1E1B16',    // surface secondary dark
    coal800: '#28241C',    // surface tertiary dark
    coal750: '#332E24',
    coal700: '#3E382B',    // border dark
    coal500: '#6B6352',    // text tertiary dark
    coal400: '#8C8374',    // icon light / text tertiary light
    coal300: '#B0A899',    // text secondary dark
    coal200: '#D4CFC5',    // borders light
    coal100: '#EAE6DF',    // surface secondary light
    coal50:  '#F5F2EC',    // bg light principal

    // ── COBRE — acento principal (reemplaza blue #3B99F7) ──
    copper600: '#8B3D07',
    copper500: '#B5530A',
    copper400: '#D4621A',  // primario light
    copper350: '#E8762E',  // primario dark
    copper300: '#F28C4E',
    copper200: '#F9B88A',
    copper100: '#FCDFC6',
    copperSubtleLight: 'rgba(212, 98, 26, 0.08)',
    copperSubtleDark:  'rgba(232, 118, 46, 0.12)',

    // ── BRASA — PRs y récords ──
    ember400: '#E8B84B',
    ember300: '#F0CC7A',
    ember200: '#F8E4B0',
    emberSubtle: 'rgba(232, 184, 75, 0.15)',
    // Para texto gold en light necesita contraste sobre blanco
    emberText:  '#9A7A1A',

    // ── ACERO — info / descanso (rol semántico específico) ──
    steel600: '#2A4A6B',
    steel500: '#3A6494',
    steel400: '#4F80B8',
    steel300: '#7AA3CC',
    steel200: '#B0C8E0',
    steelSubtleDark:  'rgba(79, 128, 184, 0.12)',
    steelSubtleLight: 'rgba(58, 100, 148, 0.08)',

    // ── SUCCESS — verde forja ──
    forgeSuccessDark:        '#3DB87A',
    forgeSuccessLight:       '#2A9E65',
    forgeSuccessSubtleDark:  'rgba(61, 184, 122, 0.12)',
    forgeSuccessSubtleLight: 'rgba(42, 158, 101, 0.10)',

    // ── DANGER ──
    forgeDangerDark:        '#E05252',
    forgeDangerLight:       '#C04040',
    forgeDangerSubtleDark:  'rgba(224, 82, 82, 0.12)',
    forgeDangerSubtleLight: 'rgba(192, 64, 64, 0.10)',

    // ── WARNING ──
    forgeWarningDark:        '#D4882A',
    forgeWarningLight:       '#A06020',
    forgeWarningSubtleDark:  'rgba(212, 136, 42, 0.12)',
    forgeWarningSubtleLight: 'rgba(160, 96, 32, 0.10)',

    // ── OVERLAYS ──
    overlayDark:  'rgba(0, 0, 0, 0.70)',
    overlayLight: 'rgba(0, 0, 0, 0.45)',

    // ── TAB BAR ──
    tabBarDark:  'rgba(22, 20, 16, 0.92)',
    tabBarLight: 'rgba(255, 255, 255, 0.90)',

    // ── BORDERS ──
    borderDark:       'rgba(255, 255, 255, 0.07)',
    borderStrongDark: 'rgba(255, 255, 255, 0.12)',
    borderLight:      'rgba(0, 0, 0, 0.08)',
    borderStrongLight:'rgba(0, 0, 0, 0.14)',
  },

  space: {
    // Escala numérica requerida por componentes internos de Tamagui (Button size="$2", etc.)
    0: 0,
    1: 4,   // = xs
    2: 8,   // = sm
    3: 12,  // = md
    4: 16,  // = lg
    5: 20,  // = xl
    6: 24,  // = 2xl
    7: 32,  // = 3xl
    8: 40,  // = 4xl
    9: 48,  // = 5xl
    // Aliases semánticos — usar estos en JSX propio
    xs:    4,
    sm:    8,
    md:    12,
    lg:    16,
    xl:    20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    true:  16,
  },

  size: {
    // Escala numérica para componentes internos de Tamagui
    0:  0,
    1:  8,
    2:  10,
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    7:  32,
    8:  40,
    9:  48,
    // Aliases semánticos
    xs:    4,
    sm:    8,
    md:    12,
    lg:    16,
    xl:    20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    // Constantes de componente — modificar aquí propaga a toda la app
    buttonHeight:    52,   // era 56; reducido para densidad
    iconButton:      40,
    inputHeight:     44,
    setRowHeight:    48,   // era 56; permite ver 5-6 sets sin scroll
    miniPlayerHeight: 56,
    true:            16,
  },

  radius: {
    0:     0,
    sm:    6,
    md:    8,
    lg:    12,
    xl:    16,
    '2xl': 24,
    full:  9999,
    true:  12,
  },

  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

// ─────────────────────────────────────────────
// TEMAS — cada valor referencia un token de color
// Cero strings hex aquí: cambiar la paleta en
// `tokens.color` propaga los cambios a toda la app.
// ─────────────────────────────────────────────

const darkTheme = {
  background:       tokens.color.coal950,
  surface:          tokens.color.coal900,
  surfaceSecondary: tokens.color.coal850,
  surfaceTertiary:  tokens.color.coal800,

  color:          tokens.color.coal50,
  textSecondary:  tokens.color.coal300,
  textTertiary:   tokens.color.coal500,

  primary:      tokens.color.copper350,
  primaryDark:  tokens.color.copper400,
  primaryLight: tokens.color.copper300,
  primarySubtle: tokens.color.copperSubtleDark,

  gold:      tokens.color.ember400,
  goldLight: tokens.color.ember300,
  goldSubtle: tokens.color.emberSubtle,

  info:      tokens.color.steel400,
  infoSubtle: tokens.color.steelSubtleDark,

  success:       tokens.color.forgeSuccessDark,
  successSubtle: tokens.color.forgeSuccessSubtleDark,
  danger:        tokens.color.forgeDangerDark,
  dangerSubtle:  tokens.color.forgeDangerSubtleDark,
  warning:       tokens.color.forgeWarningDark,
  warningSubtle: tokens.color.forgeWarningSubtleDark,

  borderColor:  tokens.color.borderDark,
  borderStrong: tokens.color.borderStrongDark,

  icon:    tokens.color.coal500,
  overlay: tokens.color.overlayDark,
  tabBar:  tokens.color.tabBarDark,
  white:   tokens.color.white,
};

const lightTheme = {
  background:       tokens.color.coal50,
  surface:          tokens.color.white,
  surfaceSecondary: tokens.color.coal100,
  surfaceTertiary:  tokens.color.coal200,

  color:         tokens.color.coal900,
  textSecondary: '#4A4337',            // entre coal700 y coal500; contraste 4.5:1 sobre blanco
  textTertiary:  tokens.color.coal400,

  primary:       tokens.color.copper400,
  primaryDark:   tokens.color.copper500,
  primaryLight:  tokens.color.copper350,
  primarySubtle: tokens.color.copperSubtleLight,

  gold:        tokens.color.emberText,    // oscuro para texto sobre fondo claro
  goldDisplay: tokens.color.ember400,     // para fills y bordes
  goldSubtle:  tokens.color.emberSubtle,

  info:       tokens.color.steel500,
  infoSubtle: tokens.color.steelSubtleLight,

  success:       tokens.color.forgeSuccessLight,
  successSubtle: tokens.color.forgeSuccessSubtleLight,
  danger:        tokens.color.forgeDangerLight,
  dangerSubtle:  tokens.color.forgeDangerSubtleLight,
  warning:       tokens.color.forgeWarningLight,
  warningSubtle: tokens.color.forgeWarningSubtleLight,

  borderColor:  tokens.color.borderLight,
  borderStrong: tokens.color.borderStrongLight,

  icon:    tokens.color.coal400,
  overlay: tokens.color.overlayLight,
  tabBar:  tokens.color.tabBarLight,
  white:   tokens.color.white,
};

const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    body: systemFont,
    heading: systemFont,
  },
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
});

export default config;

export type AppConfig = typeof config;

// ─────────────────────────────────────────────
// ESCALA TIPOGRÁFICA — única fuente de verdad
// Importar desde aquí en vez de usar tokens '$n'
// directamente en componentes (evita resolución
// incorrecta contra tokens no-font en Tamagui RC).
// ─────────────────────────────────────────────
export const FONT_SCALE = {
  sizes: {
    micro: 9,
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 30,
    display: 36,
    displayLg: 40,
    hero: 72,
  } as const,
  weights: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },
} as const;

export const THEME_FALLBACKS = {
  danger:       '#E05252',
  dangerSubtle: 'rgba(224, 82, 82, 0.12)',
} as const;

// ─────────────────────────────────────────────
// NUMERIC VARIANTS — presets tipográficos para
// cifras: tiempos, pesos, stats, contadores.
// Todos incluyen tabular-nums para alineación.
// ─────────────────────────────────────────────

export const NUMERIC_VARIANTS = {
  numericDisplay: {
    fontSize:    FONT_SCALE.sizes.hero,
    fontWeight:  FONT_SCALE.weights.bold,
    fontVariant: ['tabular-nums'] as readonly ['tabular-nums'],
    letterSpacing: -1,
  },
  numericCompact: {
    fontSize:    FONT_SCALE.sizes[5],
    fontWeight:  FONT_SCALE.weights.bold,
    fontVariant: ['tabular-nums'] as readonly ['tabular-nums'],
    letterSpacing: 0,
  },
  timerDisplay: {
    fontSize:    FONT_SCALE.sizes.hero,
    fontWeight:  FONT_SCALE.weights.bold,
    fontVariant: ['tabular-nums'] as readonly ['tabular-nums'],
    letterSpacing: -0.5,
  },
  timerCompact: {
    fontSize:    FONT_SCALE.sizes[5],
    fontWeight:  FONT_SCALE.weights.semibold,
    fontVariant: ['tabular-nums'] as readonly ['tabular-nums'],
    letterSpacing: 0,
  },
  statValue: {
    fontSize:    FONT_SCALE.sizes[7],
    fontWeight:  FONT_SCALE.weights.bold,
    fontVariant: ['tabular-nums'] as readonly ['tabular-nums'],
    letterSpacing: -0.5,
  },
} as const;

export type NumericVariant = keyof typeof NUMERIC_VARIANTS;

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}