import Animated from 'react-native-reanimated';
import React from 'react';

type WithSharedTransition = { sharedTransitionTag?: string } & React.ComponentProps<typeof Animated.View>;

export const AnimatedViewShared = Animated.View as unknown as React.ComponentType<WithSharedTransition>;
