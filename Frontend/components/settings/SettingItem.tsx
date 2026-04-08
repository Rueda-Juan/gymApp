import React from 'react';
import { Pressable, Switch } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';

export type SettingItemProps = {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
} & (
  | {
      type?: 'link';
      onPress?: () => void;
    }
  | {
      type: 'switch';
      value: boolean;
      onValueChange: (value: boolean) => void;
    }
);

export const SettingItem = React.memo(function SettingItem(props: SettingItemProps) {
  const theme = useTheme();
  const isSwitch = props.type === 'switch';
  const isDisabled = props.disabled || (!isSwitch && props.onPress == null);
  const handlePress = isSwitch ? () => props.onValueChange(!props.value) : props.onPress;
  
  return (
    <Pressable
      disabled={isDisabled}
      style={props.disabled ? { opacity: 0.4 } : undefined}
      onPress={handlePress}
      accessibilityRole={isSwitch ? 'switch' : 'button'}
      accessibilityState={isSwitch ? { checked: props.value } : { disabled: isDisabled }}
    >
      <XStack justifyContent="space-between" alignItems="center" paddingVertical="$sm">
        <XStack alignItems="center" gap="$md">
          <YStack
            width={40} 
            height={40} 
            borderRadius={20}
            alignItems="center" 
            justifyContent="center"
            backgroundColor="$surfaceSecondary"
          >
            <AppIcon icon={props.icon} size={18} color="primary" />
          </YStack>
          <AppText variant="bodyMd" fontWeight="500">{props.label}</AppText>
        </XStack>

        {!isSwitch && <AppIcon icon={ChevronRight} size={18} color="textTertiary" />}
        {isSwitch && (
          <Switch
            value={props.value}
            onValueChange={props.onValueChange}
            trackColor={{
              false: theme.surfaceSecondary?.val ?? '#cccccc',
              true: theme.primary?.val ?? '#007AFF',
            }}
            thumbColor={theme.background?.val ?? '#ffffff'}
          />
        )}
      </XStack>
    </Pressable>
  );
});
