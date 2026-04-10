import React from 'react';
import { YStack } from 'tamagui';
import { LucideIcon } from 'lucide-react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';

const ICON_CONTAINER_SIZE = 80;
const MIN_EMPTY_STATE_HEIGHT = 250;

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$lg"
      paddingVertical="$5xl"
      gap="$md"
      minHeight={MIN_EMPTY_STATE_HEIGHT}
    >
      <YStack
        width={ICON_CONTAINER_SIZE}
        height={ICON_CONTAINER_SIZE}
        borderRadius="$full"
        alignItems="center"
        justifyContent="center"
        backgroundColor="$surfaceSecondary"
        marginBottom="$sm"
      >
        <AppIcon icon={Icon} size={40} color="textTertiary" strokeWidth={1.5} />
      </YStack>

      <YStack alignItems="center" gap="$xs" paddingHorizontal="$md">
        <AppText variant="titleSm" textAlign="center" color="color">
          {title}
        </AppText>
        <AppText variant="bodyMd" color="textSecondary" textAlign="center">
          {description}
        </AppText>
      </YStack>

      {action && (
        <YStack marginTop="$lg" width="100%" alignItems="center">
          {action}
        </YStack>
      )}
    </YStack>
  );
}