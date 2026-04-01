import { FONT_SCALE } from '@/tamagui.config';

// Workaround: victory-native fontVariant expects string[], but RN types expect TextStyle['fontVariant']
export const CHART_TABULAR_NUMS = ['tabular-nums'] as any;

export const CHART_FONT_SIZE = {
  axis: FONT_SCALE.sizes[1],
  tooltip: FONT_SCALE.sizes[1],
  tooltipLarge: FONT_SCALE.sizes[2],
} as const;

interface ThemeTokens {
  textTertiary?: { val?: string };
  borderColor?: { val?: string };
  primary?: { val?: string };
  surfaceSecondary?: { val?: string };
  color?: { val?: string };
}

const CHART_FALLBACK_COLORS = {
  textSecondary: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#3B99F7',
  surface: '#1A1A24',
  text: '#FFFFFF',
} as const;

export function buildChartColors(theme: ThemeTokens) {
  return {
    textColor: theme.textTertiary?.val ?? CHART_FALLBACK_COLORS.textSecondary,
    gridColor: theme.borderColor?.val ?? CHART_FALLBACK_COLORS.border,
    primaryColor: theme.primary?.val ?? CHART_FALLBACK_COLORS.primary,
    tooltipBg: theme.surfaceSecondary?.val ?? CHART_FALLBACK_COLORS.surface,
    tooltipText: theme.color?.val ?? CHART_FALLBACK_COLORS.text,
  };
}
