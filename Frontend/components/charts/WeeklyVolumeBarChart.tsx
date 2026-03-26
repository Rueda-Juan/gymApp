import React from 'react';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory-native';
import { useTheme } from '@tamagui/core';

interface WeeklyVolumeBarChartProps {
  data: Array<{ x: string | number | Date; y: number }>;
  height?: number;
  xTickFormat?: (t: any) => string;
  yTickFormat?: (t: number) => string;
}

export function WeeklyVolumeBarChart({ data, height = 180, xTickFormat, yTickFormat }: WeeklyVolumeBarChartProps) {
  const theme = useTheme();

  return (
    <VictoryChart theme={VictoryTheme.material} height={height} domainPadding={15} padding={{ top: 16, bottom: 36, left: 40, right: 20 }}>
      <VictoryAxis
        tickFormat={xTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          ticks: { stroke: 'transparent' },
          tickLabels: { fill: theme.textTertiary?.val ?? '#9CA3AF', fontSize: 9 },
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={yTickFormat}
        style={{
          axis: { stroke: 'transparent' },
          grid: { stroke: theme.borderColor?.val ?? '#E5E7EB', strokeDasharray: '4,4' },
          tickLabels: { fill: theme.textTertiary?.val ?? '#9CA3AF', fontSize: 8 },
        }}
      />
      <VictoryBar
        data={data}
        x="x"
        y="y"
        cornerRadius={{ top: 4 }}
        style={{ data: { fill: theme.primary?.val ?? '#3B99F7', width: 16 } }}
        animate={{ duration: 350 }}
      />
    </VictoryChart>
  );
}
