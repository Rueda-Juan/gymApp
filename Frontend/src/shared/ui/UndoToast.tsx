import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeOutDown, 
  Layout,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { XStack, YStack, useTheme } from 'tamagui';
import { AppText } from './AppText';
import { RotateCcw } from 'lucide-react-native';
import { AppIcon } from './AppIcon';
import { motion } from './theme/motion';

interface UndoToastProps {
  visible: boolean;
  message: string;
  onUndo: () => void;
  bottomOffset?: number;
}

export function UndoToast({ visible, message, onUndo, bottomOffset = 100 }: UndoToastProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15).stiffness(120)}
      exiting={FadeOutDown.duration(motion.duration.fast)}
      layout={Layout.springify()}
      style={[
        styles.container,
        { bottom: bottomOffset },
      ]}
    >
      <XStack
        backgroundColor="$surfaceSecondary"
        paddingHorizontal="$lg"
        paddingVertical="$md"
        borderRadius="$xl"
        alignItems="center"
        justifyContent="space-between"
        gap="$md"
        elevation={10}
        borderWidth={1}
        borderColor="$borderColor"
        width="90%"
        maxWidth={400}
      >
        <AppText variant="bodyMd" fontWeight="600" color="color">
          {message}
        </AppText>
        
        <Pressable onPress={onUndo}>
          <XStack 
            backgroundColor="$primary" 
            paddingHorizontal="$md" 
            paddingVertical="$xs" 
            borderRadius="$lg" 
            alignItems="center" 
            gap="$xs"
          >
            <AppIcon icon={RotateCcw} size={14} color="background" />
            <AppText variant="label" color="background" fontWeight="700">
              DESHACER
            </AppText>
          </XStack>
        </Pressable>
      </XStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
});
