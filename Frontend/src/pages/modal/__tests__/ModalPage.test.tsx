import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import ModalPage from '../ModalPage';

// Mocks
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('@/shared/ui', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Screen: ({ children }: any) => <View testID="screen">{children}</View>,
    AppText: ({ children, variant }: any) => <Text testID={`text-${variant}`}>{children}</Text>,
    AppIcon: () => null,
    IconButton: ({ onPress, accessibilityLabel }: any) => (
      <TouchableOpacity onPress={onPress} testID={accessibilityLabel}>
        <Text>X</Text>
      </TouchableOpacity>
    ),
    CardBase: ({ children }: any) => <View>{children}</View>,
  };
});

// Mocking tamagui components
jest.mock('tamagui', () => {
  const { View } = require('react-native');
  return {
    YStack: ({ children }: any) => <View>{children}</View>,
    XStack: ({ children }: any) => <View style={{ flexDirection: 'row' }}>{children}</View>,
  };
});

describe('ModalPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza la información de la aplicación correctamente', () => {
    const { getByText } = render(<ModalPage />);
    
    expect(getByText('Información')).toBeTruthy();
    expect(getByText('Temper Identity')).toBeTruthy();
    expect(getByText(/Tu compañero definitivo/)).toBeTruthy();
    expect(getByText('Versión 3.0.0 (Alpha)')).toBeTruthy();
  });

  it('renderiza la sección de estado del sistema', () => {
    const { getByText } = render(<ModalPage />);
    
    expect(getByText('ESTADO DEL SISTEMA')).toBeTruthy();
    expect(getByText('Base de datos local')).toBeTruthy();
    expect(getByText('Sincronizada y segura')).toBeTruthy();
  });

  it('renderiza los enlaces de la comunidad', () => {
    const { getByText } = render(<ModalPage />);
    
    expect(getByText('COMUNIDAD')).toBeTruthy();
    expect(getByText('GitHub')).toBeTruthy();
    expect(getByText('Twitter')).toBeTruthy();
  });

  it('navega hacia atrás al presionar el botón de cerrar', () => {
    const { getByTestId } = render(<ModalPage />);
    
    const closeButton = getByTestId('Cerrar');
    fireEvent.press(closeButton);
    
    expect(router.back).toHaveBeenCalled();
  });

  it('muestra el texto del pie de página', () => {
    const { getByText } = render(<ModalPage />);
    expect(getByText('Temper')).toBeTruthy();
  });
});
