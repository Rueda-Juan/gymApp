import React from 'react';
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
import { EmptyState } from '../ui/empty-state';

interface StatsLineDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
}

interface StatsLineChartProps {
  data: StatsLineDataPoint[];
  height?: number;
  xTickFormat?: (t: any) => string;
  yTickFormat?: (t: number) => string;
}

export function StatsLineChart({
  data,
  height = 180,
  xTickFormat,
  yTickFormat,
}: StatsLineChartProps) {
  const theme = useTheme();

  const safeData = (data ?? []).filter(
    (p) => typeof p.y === 'number' && !isNaN(p.y)
  );

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

  const textColor = theme.textTertiary?.val ?? '#9CA3AF';
  const gridColor = theme.borderColor?.val ?? '#E5E7EB';
  const primaryColor = theme.primary?.val ?? '#3B99F7';
  const tooltipBg = theme.surfaceSecondary?.val ?? '#1A1A24';
  const tooltipText = theme.color?.val ?? '#FFFFFF';

  return (
    <VictoryChart
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
                fontSize: 11,
                fontVariant: ['tabular-nums'] as any,
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
      <VictoryLine
        data={safeData}
        interpolation="monotoneX"
        style={{
          data: { stroke: primaryColor, strokeWidth: 2.5 },
        }}
        animate={{ duration: 450 }}
      />
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
    </VictoryChart>
  );
}