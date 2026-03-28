import React from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { useTheme, YStack } from 'tamagui';
import { BarChart3 } from 'lucide-react-native';
import { EmptyState } from '../ui/empty-state';

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

  const textColor = theme.textTertiary?.val ?? '#9CA3AF';
  const gridColor = theme.borderColor?.val ?? '#E5E7EB';
  const primaryColor = theme.primary?.val ?? '#3B99F7';
  const tooltipBg = theme.surfaceSecondary?.val ?? '#1A1A24';
  const tooltipText = theme.color?.val ?? '#FFFFFF';

  return (
    <VictoryChart
      height={height}
      domainPadding={{ x: 15 }}
      padding={{ top: 20, bottom: 36, left: 45, right: 20 }}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) => datum.label || `${datum.y}`}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea
              style={{
                fill: tooltipText,
                fontSize: 12,
                fontVariant: ['tabular-nums'] as any,
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
          tickLabels: { fill: textColor, fontSize: 10 },
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
            fontSize: 10,
            fontVariant: ['tabular-nums'] as any,
          },
        }}
      />
      <VictoryBar
        data={safeData}
        x="x"
        y="y"
        cornerRadius={{ top: 4 }}
        style={{ data: { fill: primaryColor, width: 16 } }}
        animate={{ duration: 350 }}
      />
    </VictoryChart>
  );
}