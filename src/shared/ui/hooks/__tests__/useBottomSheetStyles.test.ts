import { renderHook } from '@testing-library/react-native';
import { useBottomSheetStyles } from '../useBottomSheetStyles';
import { useTheme } from 'tamagui';

// Mock tamagui
jest.mock('tamagui', () => ({
  useTheme: jest.fn(),
}));

describe('useBottomSheetStyles', () => {
  const mockTheme = {
    surface: { val: '#FFFFFF' },
    surfaceSecondary: { val: '#F0F0F0' },
    textTertiary: { val: '#999999' },
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  it('retorna estilos por defecto (surfaceSecondary)', () => {
    const { result } = renderHook(() => useBottomSheetStyles());
    
    expect(result.current.backgroundStyle).toEqual({
      backgroundColor: '#F0F0F0',
    });
    expect(result.current.handleIndicatorStyle).toEqual({
      backgroundColor: '#999999',
    });
  });

  it('permite cambiar el token de fondo a surface', () => {
    const { result } = renderHook(() => useBottomSheetStyles('surface'));
    
    expect(result.current.backgroundStyle).toEqual({
      backgroundColor: '#FFFFFF',
    });
  });

  it('maneja tokens faltantes devolviendo transparent', () => {
    (useTheme as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useBottomSheetStyles());
    
    expect(result.current.backgroundStyle).toEqual({
      backgroundColor: 'transparent',
    });
    expect(result.current.handleIndicatorStyle).toEqual({
      backgroundColor: 'transparent',
    });
  });
});
