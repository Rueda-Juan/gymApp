import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { useTheme, YStack } from 'tamagui';
import { LineChart as LineChartIcon } from 'lucide-react-native';
import { EmptyState } from '../ui/EmptyState';
import { buildChartColors, CHART_TABULAR_NUMS, CHART_FONT_SIZE } from './chartUtils';

const MAX_X_TICKS = 5;
const HIGH_DENSITY_THRESHOLD = 25;
const LINE_ANIMATION_DURATION_MS = 450;

interface StatsLineDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
}

interface StatsLineChartProps {
  data: StatsLineDataPoint[];
  height?: number;
  containerHorizontalPadding?: number;
  xTickFormat?: (t: string | number | Date) => string;
  yTickFormat?: (t: number) => string;
}

export function StatsLineChart({
  data,
  height = 180,
  containerHorizontalPadding = 72,
  xTickFormat,
  yTickFormat,
}: StatsLineChartProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - containerHorizontalPadding;

  const safeData = useMemo(
    () => (data ?? []).filter((p) => typeof p.y === 'number' && !isNaN(p.y)),
    [data],
  );

  const yDomain = useMemo<[number, number]>(() => {
    if (safeData.length === 0) return [0, 1];
    const ys = safeData.map((p) => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const padding = (max - min) * 0.1 || 1;
    return [Math.max(0, min - padding), max + padding];
  }, [safeData]);

  const chartColors = useMemo(() => buildChartColors(theme), [theme]);

  const isHighDensity = safeData.length > HIGH_DENSITY_THRESHOLD;

  const visibleXIndices = useMemo(() => {
    const total = safeData.length;
    if (total <= MAX_X_TICKS) return new Set(safeData.map((_, i) => i));
    const step = (total - 1) / (MAX_X_TICKS - 1);
    const indices = new Set<number>();
    for (let i = 0; i < MAX_X_TICKS; i++) {
      indices.add(Math.round(i * step));
    }
    return indices;
  }, [safeData]);

  const boundXTickFormat = useMemo(() => {
    return (tick: string | number | Date, index: number) =>
      visibleXIndices.has(index) && xTickFormat ? xTickFormat(tick) : '';
  }, [visibleXIndices, xTickFormat]);

  if (safeData.length === 0) {
    return (
      <YStack height={height} justifyContent="center" alignItems="center">
        <EmptyState
          icon={LineChartIcon}
          title="Sin historial"
          description="No hay datos suficientes para generar un gráfico de progreso."
        />
      </YStack>
    );
  }

  const { textColor, gridColor, primaryColor, tooltipBg, tooltipText } = chartColors;

  return (
    <VictoryChart
      width={chartWidth}
      height={height}
      padding={{ top: 20, bottom: 30, left: 45, right: 20 }}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) => datum.label || `${datum.y} kg`}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea
              style={{
                fill: tooltipText,
                fontSize: CHART_FONT_SIZE.tooltip,
                fontVariant: CHART_TABULAR_NUMS as any,
              }}
              flyoutStyle={{
                fill: tooltipBg,
                stroke: gridColor,
                strokeWidth: 1,
              }}
            />
          }
        />
      }
    >
      <VictoryAxis
        tickFormat={boundXTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          ticks: { stroke: 'transparent' },
          tickLabels: { fill: textColor, fontSize: CHART_FONT_SIZE.axis },
        }}
      />
      <VictoryAxis
        dependentAxis
        domain={yDomain}
        tickFormat={yTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          grid: { stroke: gridColor, strokeDasharray: '4,4' },
          tickLabels: {
            fill: textColor,
            fontSize: CHART_FONT_SIZE.axis,
            fontVariant: CHART_TABULAR_NUMS as any,
          },
        }}
      />
      <VictoryLine
        data={safeData}
        interpolation="monotoneX"
        style={{
          data: { stroke: primaryColor, strokeWidth: isHighDensity ? 2 : 2.5 },
        }}
        animate={{ duration: LINE_ANIMATION_DURATION_MS }}
      />
      {!isHighDensity && (
        <VictoryScatter
          data={safeData}
          size={({ active }) => (active ? 5 : 3)}
          style={{
            data: {
              fill: ({ active }) => (active ? primaryColor : tooltipBg),
              stroke: primaryColor,
              strokeWidth: 2,
            },
          }}
        />
      )}
    </VictoryChart>
  );
}