import React, { useMemo } from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { useTheme, YStack } from 'tamagui';
import { useWindowDimensions } from 'react-native';
import { BarChart3 } from 'lucide-react-native';
import { EmptyState } from '../ui/EmptyState';
import { buildChartColors, CHART_TABULAR_NUMS, CHART_FONT_SIZE } from './chartUtils';

const CONTAINER_HORIZONTAL_PADDING = 40;
const MIN_BAR_WIDTH = 8;
const MAX_BAR_WIDTH = 16;
const BAR_SPACING_FACTOR = 3;
const BAR_CORNER_RADIUS = 4;
const BAR_ANIMATION_DURATION_MS = 350;

function calculateLeftPadding(maxValue: number): number {
  if (maxValue >= 10_000) return 60;
  if (maxValue >= 1_000) return 50;
  return 45;
}

interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

interface WeeklyVolumeBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  xTickFormat?: (t: string | number) => string;
  yTickFormat?: (t: number) => string;
}

export function WeeklyVolumeBarChart({
  data,
  height = 180,
  xTickFormat,
  yTickFormat,
}: WeeklyVolumeBarChartProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - CONTAINER_HORIZONTAL_PADDING;

  const safeData = useMemo(
    () => (data ?? []).filter((p) => typeof p.y === 'number' && !isNaN(p.y)),
    [data],
  );

  const chartColors = useMemo(() => buildChartColors(theme), [theme]);

  if (safeData.length === 0) {
    return (
      <YStack height={height} justifyContent="center" alignItems="center">
        <EmptyState
          icon={BarChart3}
          title="Sin datos"
          description="Todavía no hay volumen registrado para este período."
        />
      </YStack>
    );
  }

  const { textColor, gridColor, primaryColor, tooltipBg, tooltipText } = chartColors;
  const barWidth = Math.max(MIN_BAR_WIDTH, Math.min(MAX_BAR_WIDTH, Math.floor(chartWidth / (safeData.length * BAR_SPACING_FACTOR))));
  const maxValue = safeData.reduce((max, p) => Math.max(max, p.y), 0);
  const leftPadding = calculateLeftPadding(maxValue);

  return (
    <VictoryChart
      width={chartWidth}
      height={height}
      domainPadding={{ x: 15 }}
      padding={{ top: 20, bottom: 36, left: leftPadding, right: 20 }}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) => datum.label || `${datum.y}`}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea
              style={{
                fill: tooltipText,
                fontSize: CHART_FONT_SIZE.tooltipLarge,
                fontVariant: CHART_TABULAR_NUMS as any,
              }}
              flyoutStyle={{
                fill: tooltipBg,
                stroke: gridColor,
                strokeWidth: 1,
              }}
              pointerLength={6}
            />
          }
        />
      }
    >
      <VictoryAxis
        tickFormat={xTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          ticks: { stroke: 'transparent' },
          tickLabels: { fill: textColor, fontSize: CHART_FONT_SIZE.axis },
        }}
      />
      <VictoryAxis
        dependentAxis
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
      <VictoryBar
        data={safeData}
        x="x"
        y="y"
        cornerRadius={{ top: BAR_CORNER_RADIUS }}
        style={{ data: { fill: primaryColor, width: barWidth } }}
        animate={{ duration: BAR_ANIMATION_DURATION_MS }}
      />
    </VictoryChart>
  );
}