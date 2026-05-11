import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { triggerLightHaptic } from '../lib/haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        triggerLightHaptic();
        scale.value = withSpring(0.92, { 
          damping: 10, 
          stiffness: 300,
          mass: 0.5
        });
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        scale.value = withSpring(1);
        props.onPressOut?.(ev);
      }}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {props.children}
      </Animated.View>
    </PlatformPressable>
  );
}
