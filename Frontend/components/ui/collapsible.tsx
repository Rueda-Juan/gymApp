import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: withTiming(isOpen ? '90deg' : '0deg', { duration: 200 }) },
      ],
    };
  });

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <YStack width="100%">
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        style={{ minHeight: 44, justifyContent: 'center' }}
      >
        <XStack alignItems="center" gap="$sm">
          <Animated.View style={iconStyle}>
            <AppIcon icon={ChevronRight} size={20} color="textSecondary" />
          </Animated.View>
          <AppText variant="titleSm" color="color">
            {title}
          </AppText>
        </XStack>
      </Pressable>

      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          layout={Layout.springify().damping(15)}
        >
          <YStack paddingLeft="$lg" paddingTop="$xs" paddingBottom="$md">
            {children}
          </YStack>
        </Animated.View>
      )}
    </YStack>
  );
}