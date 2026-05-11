import { renderHook, act } from '@testing-library/react-native';
import { useSetRowAnimation } from '../useSetRowAnimation';
import { useMotion } from '../../../lib/hooks/useMotion';
import { useSharedValue, withSpring, withTiming, withSequence } from 'react-native-reanimated';

// Mocks
jest.mock('@/shared/lib/hooks/useMotion', () => ({
  useMotion: jest.fn(() => ({
    isReduced: false,
    spring: jest.fn(() => ({})),
  })),
}));


jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: () => ({
      activeOffsetX: jest.fn().mockReturnThis(),
      failOffsetY: jest.fn().mockReturnThis(),
      enabled: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    }),
  },
}));

describe('useSetRowAnimation', () => {
  const mockThemeColors = {
    danger: '#FF0000',
    dangerSubtle: '#FFCCCC',
    surfaceSecondary: '#F0F0F0',
    successSubtle: '#CCFFCC',
  };

  const defaultProps = {
    isCompleted: false,
    showRirSelector: false,
    screenWidth: 400,
    onRemove: jest.fn(),
    themeColors: mockThemeColors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicializa los valores compartidos correctamente', () => {
    renderHook(() => useSetRowAnimation(defaultProps));
    
    expect(useSharedValue).toHaveBeenCalledWith(1); // scale
    expect(useSharedValue).toHaveBeenCalledWith(0); // rirAnim
    expect(useSharedValue).toHaveBeenCalledWith(0); // completionAnim (isCompleted: false)
    expect(useSharedValue).toHaveBeenCalledWith(0); // translateX
  });

  it('sincroniza la animación de completado', () => {
    const { result } = renderHook(() => useSetRowAnimation(defaultProps));
    
    act(() => {
      result.current.syncCompletionAnim(true);
    });
    
    expect(withTiming).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('sincroniza la animación de RIR', () => {
    const { result } = renderHook(() => useSetRowAnimation(defaultProps));
    
    act(() => {
      result.current.syncRirAnim(true);
    });
    
    expect(withSpring).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('ejecuta la animación de pop al completar', () => {
    const { result } = renderHook(() => useSetRowAnimation(defaultProps));
    
    act(() => {
      result.current.playCompletionPop();
    });
    
    expect(withSequence).toHaveBeenCalled();
  });

  it('retorna los estilos animados necesarios', () => {
    const { result } = renderHook(() => useSetRowAnimation(defaultProps));
    
    expect(result.current.styles).toHaveProperty('swipeRow');
    expect(result.current.styles).toHaveProperty('deleteButtonOpacity');
    expect(result.current.styles).toHaveProperty('animatedCheck');
    expect(result.current.styles).toHaveProperty('rirGroup');
  });
});
