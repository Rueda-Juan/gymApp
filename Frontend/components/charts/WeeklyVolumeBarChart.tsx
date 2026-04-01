import React from 'react';
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
import { EmptyState } from '../ui/empty-state';
import { buildChartColors, CHART_TABULAR_NUMS, CHART_FONT_SIZE } from './chartUtils';

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
  const chartWidth = screenWidth - 40;

  const safeData = (data ?? []).filter(
    (p) => typeof p.y === 'number' && !isNaN(p.y)
  );

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

  const { textColor, gridColor, primaryColor, tooltipBg, tooltipText } = buildChartColors(theme);
  const barWidth = Math.max(8, Math.min(16, Math.floor(chartWidth / (safeData.length * 3))));
  const maxValue = safeData.reduce((max, p) => Math.max(max, p.y), 0);
  const leftPadding = maxValue >= 10000 ? 60 : maxValue >= 1000 ? 50 : 45;

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
                fontVariant: CHART_TABULAR_NUMS,
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
            fontVariant: CHART_TABULAR_NUMS,
          },
        }}
      />
      <VictoryBar
        data={safeData}
        x="x"
        y="y"
        cornerRadius={{ top: 4 }}
        style={{ data: { fill: primaryColor, width: barWidth } }}
        animate={{ duration: 350 }}
      />
    </VictoryChart>
  );
}