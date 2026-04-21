
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, Text, AccessibilityInfo } from 'react-native';
import { MOTION } from '../../app/design/tokens/motion';

const AnimatedTrophyCard = () => {
  const scale = useSharedValue(0.8);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!reduceMotion) {
        scale.value = withSpring(1, { duration: MOTION.standard });
      } else {
        scale.value = 1;
      }
    });
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={[{ backgroundColor: '#FDE68A', padding: 24, borderRadius: 16, alignItems: 'center' }, animatedStyle]} accessibilityLabel="Trofeo animado">
      <Text style={{ fontSize: 32, color: '#B45309', fontWeight: 'bold' }}>🏆</Text>
      <Text style={{ color: '#B45309', fontWeight: 'bold', marginTop: 8 }}>Trophy!</Text>
    </Animated.View>
  );
};

export default AnimatedTrophyCard;
