import { YStack } from 'tamagui';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { AppText } from './AppText';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" p="$5xl" gap="$lg">
      <YStack width={64} height={64} borderRadius="$full" alignItems="center" justifyContent="center" backgroundColor="$surfaceSecondary">
        <Icon size={32} color="$icon" />
      </YStack>
      <AppText variant="titleSm" textAlign="center">
        {title}
      </AppText>
      <AppText variant="bodyMd" color="textSecondary" textAlign="center" lineHeight={20}>
        {description}
      </AppText>
      {action && <YStack mt="$xl" width="100%">{action}</YStack>}
    </YStack>
  );
}
