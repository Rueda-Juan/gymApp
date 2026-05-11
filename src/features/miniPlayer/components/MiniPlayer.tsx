import React from 'react';
import { XStack, YStack } from 'tamagui';
import { Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatRestDuration } from '@/shared/lib/time';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { AppButton } from '@/shared/ui/AppButton';
import { motion } from '@/shared/constants/motion';
import { elevation } from '@/shared/constants/elevation';
import { useMotion } from '@/shared/lib/hooks/useMotion';
import { useMiniPlayerState } from '../model/useMiniPlayerState';

const HORIZONTAL_INSET = 12;
const TAB_BAR_OFFSET = 60;
const FLOATING_Z_INDEX = 100;

export function MiniPlayer() {
  const motionHelpers = useMotion();
  const insets = useSafeAreaInsets();
  const { isActive, currentExerciseName, restIsActive, restSecondsLeft, handleRetomar } =
    useMiniPlayerState();

  if (!isActive) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      entering={motionHelpers.entering(FadeInDown.duration(motion.duration.slow))}
      exiting={motionHelpers.exiting(FadeOutDown.duration(motion.duration.slow))}
      style={{
        position: 'absolute',
        left: HORIZONTAL_INSET,
        right: HORIZONTAL_INSET,
        bottom: insets.bottom + TAB_BAR_OFFSET,
        zIndex: FLOATING_Z_INDEX,
      }}
      accessible={false}
    >
      <XStack
        height="$miniPlayerHeight"
        borderRadius="$xl"
        borderCurve="continuous"
        backgroundColor="$surfaceSecondary"
        borderColor="$borderColor"
        borderWidth={1}
        alignItems="center"
        paddingHorizontal="$md"
        gap="$md"
        {...elevation.floating}
      >
        <YStack
          width="$iconButton"
          height="$iconButton"
          borderRadius="$md"
          borderCurve="continuous"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$primarySubtle"
        >
          <AppIcon icon={Activity} size={20} color="primary" />
        </YStack>

        <AppText variant="bodyMd" color="color" numberOfLines={1} fontWeight="600" flex={1}>
          {currentExerciseName}
        </AppText>

        {restIsActive && (
          <AppText variant="titleSm" color="success" tabularNums>
            {formatRestDuration(restSecondsLeft)}
          </AppText>
        )}

        <AppButton
          appVariant="ghost"
          size="sm"
          label="Retomar"
          fullWidth={false}
          height={32}
          onPress={handleRetomar}
        />
      </XStack>
    </Animated.View>
  );
}

