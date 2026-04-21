import Animated from 'react-native-reanimated';
import React from 'react';

type WithSharedTransition = { sharedTransitionTag?: string } & React.ComponentProps<typeof Animated.View>;

const AnimatedViewShared = Animated.View as unknown as React.ComponentType<WithSharedTransition>;

export default AnimatedViewShared;
