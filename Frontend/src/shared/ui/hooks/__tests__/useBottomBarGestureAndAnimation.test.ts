import { renderHook } from '@testing-library/react-native';
import { useBottomBarGestureAndAnimation } from '../useBottomBarGestureAndAnimation';
import { useTheme } from 'tamagui';
import { useMotion } from '../../../lib/hooks/useMotion';
import { useSharedValue } from 'react-native-reanimated';

// Mocks
jest.mock('tamagui', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/shared/lib/hooks/useMotion', () => ({
  useMotion: jest.fn(),
}));

jest.mock('@/shared/lib/instrumentation', () => ({
  logEvent: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  const Easing = {
    out: jest.fn(() => ({})),
    in: jest.fn(() => ({})),
    inOut: jest.fn(() => ({})),
    bezier: jest.fn(() => ({})),
    ease: jest.fn(),
    cubic: jest.fn(),
    quad: jest.fn(),
    linear: jest.fn(),
  };
  return {
    ...Reanimated,
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    withSequence: jest.fn(),
    withTiming: jest.fn(),
    withSpring: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
    Easing,
  };
});

jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Pan: () => ({
        activeOffsetY: jest.fn().mockReturnThis(),
        failOffsetX: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
    },
  };
});

describe('useBottomBarGestureAndAnimation', () => {
  const mockOnOpenPlateCalculator = jest.fn();
  const mockTheme = {
    textTertiary: { val: '#999999' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
    (useMotion as jest.Mock).mockReturnValue({ isReduced: false });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retorna el color del handle basado en el tema', () => {
    const { result } = renderHook(() => useBottomBarGestureAndAnimation({ 
      insetsBottom: 20, 
      onOpenPlateCalculator: mockOnOpenPlateCalculator 
    }));
    
    expect(result.current.handleColor).toBe('#999999');
  });

  it('usa un color fallback si el tema no tiene el token', () => {
    (useTheme as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useBottomBarGestureAndAnimation({ 
      insetsBottom: 20, 
      onOpenPlateCalculator: mockOnOpenPlateCalculator 
    }));
    
    expect(result.current.handleColor).toBe('#6B6352');
  });

  it('inicia una animación de rebote (bounce) periódica si no hay movimiento reducido', () => {
    renderHook(() => useBottomBarGestureAndAnimation({ 
      insetsBottom: 20, 
      onOpenPlateCalculator: mockOnOpenPlateCalculator 
    }));
    
    const { withSequence } = require('react-native-reanimated');
    
    // Avanzar el tiempo para que el intervalo se ejecute
    jest.advanceTimersByTime(15000); // BOUNCE_INTERVAL_MS es 15000 por defecto
    
    expect(withSequence).toHaveBeenCalled();
  });

  it('no inicia la animación si isReduced es true', () => {
    (useMotion as jest.Mock).mockReturnValue({ isReduced: true });
    renderHook(() => useBottomBarGestureAndAnimation({ 
      insetsBottom: 20, 
      onOpenPlateCalculator: mockOnOpenPlateCalculator 
    }));
    
    const { withSequence } = require('react-native-reanimated');
    jest.advanceTimersByTime(15000);
    
    expect(withSequence).not.toHaveBeenCalled();
  });
});
