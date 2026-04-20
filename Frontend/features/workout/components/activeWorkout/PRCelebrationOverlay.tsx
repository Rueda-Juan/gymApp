import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withSequence, 
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { YStack, XStack, useTheme } from 'tamagui';
import { Trophy } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 30;
const PARTICLE_COLORS = ['#FFD700', '#FFA500', '#FF4D4D', '#4DFF4D', '#4D4DFF', '#FFFFFF'];

interface ParticleProps {
  index: number;
}

function Particle({ index }: ParticleProps) {
  const angle = useMemo(() => (index / PARTICLE_COUNT) * 2 * Math.PI, [index]);
  const distance = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  // Memoize config to avoid random shifts on re-renders
  const config = useMemo(() => ({
    finalDistance: 100 + Math.random() * 200,
    duration: 1000 + Math.random() * 500,
    color: PARTICLE_COLORS[index % PARTICLE_COLORS.length]
  }), [index]);

  useEffect(() => {
    scale.value = withSpring(1);
    distance.value = withTiming(config.finalDistance, { 
      duration: config.duration,
      easing: Easing.out(Easing.quad)
    });
    opacity.value = withDelay(config.duration * 0.6, withTiming(0, { duration: 400 }));
  }, [config]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const tx = Math.cos(angle) * distance.value;
    const ty = Math.sin(angle) * distance.value - (distance.value * 0.5); 
    
    return {
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: config.color,
      opacity: opacity.value,
      transform: [
        { translateX: tx },
        { translateY: ty },
        { scale: scale.value }
      ]
    };
  });

  return <Animated.View style={animatedStyle} />;
}

interface PRCelebrationOverlayProps {
  visible: boolean;
  onFinished: () => void;
}

export function PRCelebrationOverlay({ visible, onFinished }: PRCelebrationOverlayProps) {
  const [active, setActive] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const trophyY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      setActive(true);
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      trophyY.value = withSpring(0, { damping: 10, stiffness: 80 });
      
      // Sequence of haptics
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
      setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 400);

      // Auto finish
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(onFinished)();
          runOnJS(setActive)(false);
        });
      }, 3000);
    }
  }, [visible]);

  // Precompute particles and animated styles with hooks so order is stable
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
    <Particle key={i} index={i} />
  )), []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: trophyY.value }
    ],
  }));

  if (!active) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <YStack alignItems="center" justifyContent="center" gap="$xl">
        <Animated.View style={contentStyle}>
          <YStack 
            backgroundColor="$goldSubtle" 
            padding="$xl" 
            borderRadius={999}
            borderWidth={4}
            borderColor="$gold"
            elevation={20}
          >
            <AppIcon icon={Trophy} size={80} color="gold" />
          </YStack>
        </Animated.View>

        <YStack alignItems="center" gap="$sm">
          <AppText variant="titleLg" color="gold" textAlign="center">
            ¡NUEVO RÉCORD!
          </AppText>
          <AppText variant="bodyLg" color="color" fontWeight="600">
            Estás superando tus límites
          </AppText>
        </YStack>

        <XStack position="absolute" pointerEvents="none">
          {particles}
        </XStack>
      </YStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
