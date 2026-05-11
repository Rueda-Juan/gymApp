// 🖐️ Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureDetector: ({ children }) => children,
    GestureHandlerRootView: ({ children }) => <View>{children}</View>,
    Gesture: {
      Pan: () => ({
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
        activeCursor: jest.fn().mockReturnThis(),
        withTestId: jest.fn().mockReturnThis(),
        activeOffsetY: jest.fn().mockReturnThis(),
        failOffsetX: jest.fn().mockReturnThis(),
      }),
      Tap: () => ({
        onEnd: jest.fn().mockReturnThis(),
        withTestId: jest.fn().mockReturnThis(),
      }),
    },

    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
  };
});

// 🎬 Reanimated (robusto)
jest.mock('react-native-reanimated', () => {
  const { View, Text, Image } = require('react-native');
  const React = require('react');

  return {
    __esModule: true,
    default: {
      View,
      Text,
      Image,
      createAnimatedComponent: (c) => c,
    },
    View,
    Text,
    Image,
    createAnimatedComponent: (c) => c,
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn((cb) => cb() || {}),
    useAnimatedProps: jest.fn((cb) => cb() || {}),
    useDerivedValue: jest.fn((cb) => ({ value: cb() })),
    useReducedMotion: jest.fn(() => false),
    withTiming: jest.fn((val, _config, cb) => {
      if (cb) cb(true);
      return val;
    }),
    withSpring: jest.fn((val, _config, cb) => {
      if (cb) cb(true);
      return val;
    }),
    withDelay: jest.fn((_delay, animation) => animation),
    withSequence: jest.fn((...animations) => animations[0]),
    withRepeat: (animation) => animation,
    cancelAnimation: jest.fn(),
    runOnJS: (fn) => fn,
    interpolate: jest.fn((val, _input, output) => output[0]),
    interpolateColor: jest.fn(() => 'red'),
    Extrapolate: { CLAMP: 'clamp', IDENTITY: 'identity', EXTEND: 'extend' },
    Easing: {
      linear: jest.fn((v) => v),
      ease: jest.fn((v) => v),
      quad: jest.fn((v) => v),
      cubic: jest.fn((v) => v),
      poly: jest.fn((v) => v),
      sin: jest.fn((v) => v),
      circle: jest.fn((v) => v),
      exp: jest.fn((v) => v),
      elastic: jest.fn((v) => v),
      back: jest.fn((v) => v),
      bounce: jest.fn((v) => v),
      bezier: jest.fn(() => (v) => v),
      in: jest.fn((f) => f),
      out: jest.fn((f) => f),
      inOut: jest.fn((f) => f),
    },
    FadeIn: { duration: () => ({ delay: () => ({ springify: () => {} }) }), springify: () => ({ delay: () => {} }) },
    FadeOut: { duration: () => ({ delay: () => ({ springify: () => {} }) }), springify: () => ({ delay: () => {} }) },
    FadeInDown: { duration: () => ({ delay: () => ({ springify: () => {} }) }), springify: () => ({ delay: () => ({ springify: () => {} }) }), delay: () => ({ springify: () => {} }) },
    FadeInUp: { duration: () => ({ delay: () => ({ springify: () => {} }) }), springify: () => ({ delay: () => {} }) },
    SlideInUp: { springify: () => ({ damping: () => ({ stiffness: () => {} }) }) },
    Layout: { springify: () => ({ damping: () => {} }) },
  };
});


// -----------------------------
// 📦 Bottom Sheet
// -----------------------------
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }) => children,
    BottomSheetModal: React.forwardRef(({ children }, ref) => React.createElement(View, { ref }, children)),
    BottomSheetView: ({ children }) => children,
    BottomSheetScrollView: ({ children }) => children,
    BottomSheetFlatList: ({ children }) => children,
    BottomSheetTextInput: (props) => React.createElement('TextInput', props),
    BottomSheetBackdrop: () => null,
    BottomSheetModalProvider: ({ children }) => children,
  };
});


// 🌍 Env controlado (sin hardcode peligroso)
process.env.EXPO_OS = process.env.EXPO_OS || 'android';

// -----------------------------
// 📦 Expo Router (mock mínimo)
// -----------------------------
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/'),
}));

// -----------------------------
// 📱 Navigation
// -----------------------------
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useIsFocused: () => true,
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(() => {
        callback();
      }, [callback]);
    }),
  };
});


// -----------------------------
// 🧱 Native libs livianas
// -----------------------------
jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));


jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, style }) => <View style={style}>{children}</View>,
  };
});


// 🎨 Tamagui (ligero)
jest.mock('tamagui', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    YStack: (props) => <View {...props} />,
    XStack: (props) => <View {...props} />,
    ZStack: (props) => <View {...props} />,
    Stack: (props) => <View {...props} />,
    View: (props) => <View {...props} />,
    Text: (props) => <Text {...props} />,
    ScrollView: (props) => {
      const { ScrollView } = require('react-native');
      return <ScrollView {...props} />;
    },

    Button: (props) => {
      const { TouchableOpacity } = require('react-native');
      const { width, flex, height, borderRadius, backgroundColor, ...rest } = props;
      const style = { ...props.style, width, flex, height, borderRadius, backgroundColor };
      return <TouchableOpacity {...rest} style={style} />;
    },
    Input: (props) => {
      const React = require('react');
      const { TextInput } = require('react-native');
      return React.createElement(TextInput, props);
    },
    Theme: ({ children }) => children,

    useTheme: () => ({
      primary: { val: '#E8762E' },
      background: { val: '#000000' },
      color: { val: '#FFFFFF' },
      borderColor: { val: '#333333' },
    }),
    createTamagui: (config) => config,
    createFont: (font) => font,
    createTokens: (tokens) => tokens,
    TamaguiProvider: ({ children }) => children,
  };
});

// 💡 Lucide Icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props) => <View {...props} />;
  return {
    Check: MockIcon,
    Flame: MockIcon,
    Trash2: MockIcon,
    ChevronDown: MockIcon,
    ChevronUp: MockIcon,
    X: MockIcon,
    MoreVertical: MockIcon,
    Plus: MockIcon,
    SkipForward: MockIcon,
    TrendingUp: MockIcon,
    ChevronLeft: MockIcon,
    ChevronRight: MockIcon,
    History: MockIcon,
    Search: MockIcon,
    Timer: MockIcon,
    Dumbbell: MockIcon,
    User: MockIcon,
    Settings: MockIcon,
    Calendar: MockIcon,
    BarChart2: MockIcon,
    Play: MockIcon,
    StopCircle: MockIcon,
    ArrowLeft: MockIcon,
    ArrowRight: MockIcon,
    Copy: MockIcon,
    Edit2: MockIcon,
    Info: MockIcon,
    Clock: MockIcon,
    Activity: MockIcon,
    Hourglass: MockIcon,
    PenLine: MockIcon,

  };
});
