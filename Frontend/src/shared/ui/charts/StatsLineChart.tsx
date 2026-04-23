import React from 'react';
import { useTheme } from 'tamagui';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter } from 'victory-native';
import { View } from 'react-native';

interface ChartPoint {
  x: string | number;
  y: number;
}

interface StatsLineChartProps {
  data: ChartPoint[];
  height?: number;
  xTickFormat?: (x: any) => string;
}

export const StatsLineChart = ({ data, height = 150, xTickFormat }: StatsLineChartProps) => {
  const theme = useTheme();

  const lineColor = theme.primary?.val || '#D4882A';
  const axisColor = theme.textTertiary?.val || '#999';
  const labelColor = theme.textSecondary?.val || '#666';

  return (
    <View style={{ height, width: '100%', marginLeft: -20 }}>
      <VictoryChart
        height={height}
        padding={{ top: 10, bottom: 30, left: 40, right: 20 }}
      >
        <VictoryAxis
          tickFormat={xTickFormat}
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fill: axisColor, fontSize: 10 },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'transparent' },
            grid: { stroke: theme.borderColor?.val || '#eee', strokeDasharray: '4, 4' },
            tickLabels: { fill: axisColor, fontSize: 10 },
          }}
        />
        <VictoryLine
          data={data}
          style={{
            data: { stroke: lineColor, strokeWidth: 3 },
          }}
          interpolation="monotoneX"
        />
        <VictoryScatter
          data={data}
          size={4}
          style={{
            data: { fill: lineColor },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default StatsLineChart;
