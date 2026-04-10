import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/ui/useMotion';

const REVEAL_DURATION = motion.duration.normal;
const SKELETON_FADE_DELAY = 50;

interface ContentRevealProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

export function ContentReveal({ loading, skeleton, children }: ContentRevealProps) {
  const { isReduced } = useMotion();
  const contentOpacity = useSharedValue(loading ? 0 : 1);
  const skeletonOpacity = useSharedValue(loading ? 1 : 0);
  const [showSkeleton, setShowSkeleton] = useState(loading);

  useEffect(() => {
    if (isReduced) {
      contentOpacity.value = loading ? 0 : 1;
      skeletonOpacity.value = loading ? 1 : 0;
      setShowSkeleton(loading);
      return;
    }

    if (loading) {
      cancelAnimation(contentOpacity);
      cancelAnimation(skeletonOpacity);
      setShowSkeleton(true);
      skeletonOpacity.value = 1;
      contentOpacity.value = 0;
    } else {
      contentOpacity.value = withTiming(1, {
        duration: REVEAL_DURATION,
        easing: motion.easing.standard,
      });
      skeletonOpacity.value = withDelay(
        SKELETON_FADE_DELAY,
        withTiming(0, {
          duration: REVEAL_DURATION,
          easing: motion.easing.standard,
        }, (finished) => {
          if (finished) runOnJS(setShowSkeleton)(false);
        }),
      );
    }

    return () => {
      cancelAnimation(contentOpacity);
      cancelAnimation(skeletonOpacity);
    };
  }, [loading, isReduced, contentOpacity, skeletonOpacity]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const skeletonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skeletonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentLayer, contentAnimatedStyle]} pointerEvents={loading ? 'none' : 'auto'}>
        {children}
      </Animated.View>
      {showSkeleton && (
        <Animated.View style={[StyleSheet.absoluteFillObject, skeletonAnimatedStyle]} pointerEvents="none">
          {skeleton}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentLayer: {
    flex: 1,
  },
});
