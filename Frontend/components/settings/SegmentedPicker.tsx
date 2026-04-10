import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { type LucideIcon } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';

export interface SegmentedPickerProps<T extends string> {
  icon: LucideIcon;
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onValueChange: (value: T) => void;
}

export function SegmentedPicker<T extends string>({ icon, label, options, labels, value, onValueChange }: SegmentedPickerProps<T>) {
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingVertical="$sm">
      <XStack alignItems="center" gap="$md">
        <YStack
          width={40}
          height={40}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$surfaceSecondary"
        >
          <AppIcon icon={icon} size={18} color="primary" />
        </YStack>
        <AppText variant="bodyMd" fontWeight="500">{label}</AppText>
      </XStack>
      <XStack gap="$xs">
        {options.map((option) => {
          const isActive = value === option;
          return (
            <Pressable key={option} onPress={() => onValueChange(option)}>
              <YStack
                paddingHorizontal="$sm"
                paddingVertical="$xs"
                borderRadius="$md"
                borderWidth={1}
                borderColor={isActive ? '$primary' : '$borderColor'}
                backgroundColor={isActive ? '$primarySubtle' : '$surfaceSecondary'}
              >
                <AppText
                  variant="label"
                  fontWeight="700"
                  color={isActive ? 'primary' : 'textSecondary'}
                >
                  {labels[option]}
                </AppText>
              </YStack>
            </Pressable>
          );
        })}
      </XStack>
    </XStack>
  );
}
