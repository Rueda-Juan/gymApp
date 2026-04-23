process.env.EXPO_OS = process.env.EXPO_OS || 'android';
process.env.TAMAGUI_DISABLE_RN = '1';

jest.mock('react-native-reanimated', () => {
  const Easing = {
    bezier: jest.fn(() => (t) => t),
    out: jest.fn((f) => f),
    in: jest.fn((f) => f),
    inOut: jest.fn((f) => f),
    linear: jest.fn((t) => t),
    ease: jest.fn((t) => t),
    quad: jest.fn((t) => t),
    cubic: jest.fn((t) => t),
    poly: jest.fn((t) => t),
    sin: jest.fn((t) => t),
    circle: jest.fn((t) => t),
    exp: jest.fn((t) => t),
    elastic: jest.fn((t) => t),
    back: jest.fn((t) => t),
    bounce: jest.fn((t) => t),
  };

  const Fade = {
    duration: jest.fn().mockReturnThis(),
    delay: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnThis(),
    damping: jest.fn().mockReturnThis(),
    stiffness: jest.fn().mockReturnThis(),
    withCallback: jest.fn().mockReturnThis(),
  };

  const mockReanimated = {
    __esModule: true,
    Easing,
    FadeIn: Fade,
    FadeOut: Fade,
    FadeInDown: Fade,
    FadeOutDown: Fade,
    FadeInUp: Fade,
    FadeOutUp: Fade,
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    cancelAnimation: jest.fn(),
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    withTiming: jest.fn((v) => v),
    withSpring: jest.fn((v) => v),
    useAnimatedProps: jest.fn((fn) => fn()),
    interpolate: jest.fn((v, i, o) => o[0]),
    interpolateColor: jest.fn((v, i, o) => o[0]),
    useAnimatedScrollHandler: jest.fn(() => () => {}),
    Extrapolation: { CLAMP: 'clamp', IDENTITY: 'identity', EXTEND: 'extend' },
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    ScrollView: 'ScrollView',
    createAnimatedComponent: jest.fn((cb) => cb),
    default: {
      Easing,
      createAnimatedComponent: jest.fn((cb) => cb),
    },
  };

  // Add self-reference to default for cases where it's accessed via .default
  mockReanimated.default = {
    ...mockReanimated,
    ...mockReanimated.default,
  };

  return mockReanimated;
});

jest.mock('react-native-gesture-handler', () => {
  const Gesture = {
    Pan: jest.fn(() => ({
      activeOffsetY: jest.fn().mockReturnThis(),
      failOffsetX: jest.fn().mockReturnThis(),
      activeOffsetX: jest.fn().mockReturnThis(),
      failOffsetY: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onStart: jest.fn().mockReturnThis(),
      enabled: jest.fn().mockReturnThis(),
      shouldCancelWhenOutside: jest.fn().mockReturnThis(),
    })),
    Tap: jest.fn(() => ({
      onEnd: jest.fn().mockReturnThis(),
      enabled: jest.fn().mockReturnThis(),
    })),
    Native: jest.fn(() => ({
      enabled: jest.fn().mockReturnThis(),
    })),
  };
  return {
    Gesture,
    GestureDetector: ({ children }) => children,
    GestureHandlerRootView: ({ children }) => children,
    State: {},
    PanGestureHandler: 'PanGestureHandler',
    TapGestureHandler: 'TapGestureHandler',
  };
});
