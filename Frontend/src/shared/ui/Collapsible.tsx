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
import { ChevronRight } from 'lucide-react-native';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { motion } from '@/constants/motion';
import { triggerLightHaptic } from '@/utils/haptics';

const MIN_TOUCH_TARGET = 44;

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
        { rotate: withTiming(isOpen ? '90deg' : '0deg', { duration: motion.duration.normal }) },
      ],
    };
  });

  const handlePress = () => {
    triggerLightHaptic();
    setIsOpen((prev) => !prev);
  };

  return (
    <YStack width="100%">
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        style={{ minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' }}
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
          entering={FadeIn.duration(motion.duration.normal)}
          exiting={FadeOut.duration(motion.duration.normal)}
          layout={Layout.springify().damping(motion.spring.snappy.damping)}
        >
          <YStack paddingLeft="$lg" paddingTop="$xs" paddingBottom="$md">
            {children}
          </YStack>
        </Animated.View>
      )}
    </YStack>
  );
}