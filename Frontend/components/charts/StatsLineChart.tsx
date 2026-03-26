import React from 'react';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, VictoryAxis } from 'victory-native';
import { useTheme } from '@tamagui/core';

interface StatsLineChartProps {
  data: Array<{ x: string | number | Date; y: number }>;
  height?: number;
  xTickFormat?: (t: any) => string;
  yTickFormat?: (t: number) => string;
}

export function StatsLineChart({ data, height = 140, xTickFormat, yTickFormat }: StatsLineChartProps) {
  const theme = useTheme();

  return (
    <VictoryChart theme={VictoryTheme.material} height={height} padding={{ top: 10, bottom: 20, left: 40, right: 20 }}>
      <VictoryAxis
        tickFormat={xTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          ticks: { stroke: 'transparent' },
          tickLabels: { fill: theme.textTertiary?.val ?? '#9CA3AF', fontSize: 9 },
          grid: { stroke: 'transparent' },
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={yTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          grid: { stroke: theme.borderColor?.val ?? '#E5E7EB', strokeDasharray: '4,4' },
          tickLabels: { fill: theme.textTertiary?.val ?? '#9CA3AF', fontSize: 9 },
        }}
      />
      <VictoryLine
        data={data}
        style={{ data: { stroke: theme.primary?.val ?? '#3B99F7', strokeWidth: 2 } }}
        animate={{ duration: 400 }}
      />
      <VictoryScatter
        data={data}
        size={3}
        style={{ data: { fill: theme.primary?.val ?? '#3B99F7' } }}
      />
    </VictoryChart>
  );
}
