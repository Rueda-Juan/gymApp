import React from 'react';
import { View, ScrollView } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { FONT_SCALE } from '@/tamagui.config';

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const MONTH_CELL_SIZE = 14;
const MONTH_CELL_GAP = 2;
const YEAR_CELL_SIZE = 5;
const YEAR_CELL_GAP = 1;

export interface ActivityGridProps {
  trainedDates: Set<string>;
}

function toYMD(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

const MonthGrid = React.memo(function MonthGrid({ trainedDates }: { trainedDates: Set<string> }) {
  const theme = useTheme();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const paddedCells: (Date | null)[] = Array(firstDay.getDay()).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    paddedCells.push(new Date(year, month, d));
  }
  while (paddedCells.length % 7 !== 0) paddedCells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedCells.length; i += 7) {
    weeks.push(paddedCells.slice(i, i + 7));
  }

  const colWidth = MONTH_CELL_SIZE + MONTH_CELL_GAP;

  return (
    <YStack gap={MONTH_CELL_GAP}>
      <XStack>
        {DAY_LABELS.map((label) => (
          <View key={label} style={{ width: colWidth, alignItems: 'center' }}>
            <AppText variant="label" color="textTertiary" style={{ fontSize: FONT_SCALE.sizes.micro }}>
              {label}
            </AppText>
          </View>
        ))}
      </XStack>

      {weeks.map((week, weekIdx) => (
        <XStack key={weekIdx}>
          {week.map((date, dayIdx) =>
            date ? (
              <View
                key={dayIdx}
                style={{
                  width: MONTH_CELL_SIZE,
                  height: MONTH_CELL_SIZE,
                  borderRadius: 3,
                  marginRight: MONTH_CELL_GAP,
                  backgroundColor: trainedDates.has(toYMD(date))
                    ? theme.primary?.val as string
                    : theme.surfaceSecondary?.val as string,
                }}
              />
            ) : (
              <View key={dayIdx} style={{ width: colWidth, height: MONTH_CELL_SIZE }} />
            )
          )}
        </XStack>
      ))}
    </YStack>
  );
});

const YearGrid = React.memo(function YearGrid({ trainedDates }: { trainedDates: Set<string> }) {
  const theme = useTheme();
  const now = new Date();
  const year = now.getFullYear();
  const jan1 = new Date(year, 0, 1);

  const gridStart = new Date(jan1);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const columns: Date[][] = [];
  const cursor = new Date(gridStart);

  while (columns.length < 54) {
    const week: Date[] = [];
    for (let row = 0; row < 7; row++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    const weekHasCurrentYear = week.some(d => d.getFullYear() === year);
    if (!weekHasCurrentYear && columns.length > 0) break;
    columns.push(week);
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <XStack gap={YEAR_CELL_GAP}>
        {columns.map((week, colIdx) => (
          <YStack key={colIdx} gap={YEAR_CELL_GAP}>
            {week.map((date, rowIdx) => {
              const isCurrentYear = date.getFullYear() === year;
              const isInFuture = date > now;
              const trained = isCurrentYear && !isInFuture && trainedDates.has(toYMD(date));
              return (
                <View
                  key={rowIdx}
                  style={{
                    width: YEAR_CELL_SIZE,
                    height: YEAR_CELL_SIZE,
                    borderRadius: 1,
                    backgroundColor: isCurrentYear
                      ? trained
                        ? theme.primary?.val as string
                        : theme.surfaceSecondary?.val as string
                      : 'transparent',
                  }}
                />
              );
            })}
          </YStack>
        ))}
      </XStack>
    </ScrollView>
  );
});

export function ActivityGrid({ trainedDates }: ActivityGridProps) {
  return (
    <YStack gap="$xl">
      <YStack gap="$sm" alignItems="center">
          <AppText variant="label" color="textTertiary">ESTE MES</AppText>
          <MonthGrid trainedDates={trainedDates} />
        </YStack>
      <YStack gap="$sm" alignItems="center">
        <AppText variant="label" color="textTertiary">ESTE AÑO</AppText>
        <YearGrid trainedDates={trainedDates} />
      </YStack>
    </YStack>
  );
}
