import React from 'react';
import { FlatList, FlatListProps, StyleSheet } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { AppText } from '@/shared/ui/AppText';
import { CardBase } from '@/shared/ui/Card';
import { getExerciseName } from '../lib/exercise';
import type { Exercise } from '@kernel';
import { ExerciseCardSkeleton } from '@/shared/ui/layout/Loaders';
import { ContentReveal } from '@/shared/ui/feedback/ContentReveal';

interface ExerciseListProps extends Omit<FlatListProps<Exercise>, 'renderItem' | 'data'> {
  exercises: Exercise[];
  loading?: boolean;
  onExercisePress?: (exercise: Exercise) => void;
}

export function ExerciseList({ 
  exercises, 
  loading, 
  onExercisePress, 
  contentContainerStyle,
  ...props 
}: ExerciseListProps) {
  const renderItem = ({ item }: { item: Exercise }) => (
    <CardBase 
      marginBottom="$md" 
      onPress={onExercisePress ? () => onExercisePress(item) : undefined}
      testID={`exercise-option-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
    >
      <YStack gap="$xs">
        <AppText variant="bodyMd" fontWeight="600">
          {getExerciseName(item)}
        </AppText>
        <XStack gap="$xs" flexWrap="wrap">
          {item.primaryMuscles?.map(m => (
            <AppText key={m} variant="label" color="textTertiary">
              {m.toUpperCase()}
            </AppText>
          ))}
        </XStack>
      </YStack>
    </CardBase>
  );

  return (
    <ContentReveal
      loading={!!loading}
      skeleton={
        <YStack paddingHorizontal="$lg" gap="$md">
          <ExerciseCardSkeleton />
          <ExerciseCardSkeleton />
          <ExerciseCardSkeleton />
          <ExerciseCardSkeleton />
        </YStack>
      }
    >
      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.container, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        {...props}
      />
    </ContentReveal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
});

