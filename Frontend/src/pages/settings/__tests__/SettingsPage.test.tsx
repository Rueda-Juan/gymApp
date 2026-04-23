import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import SettingsPage from '../SettingsPage';

// Mocks
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});

jest.mock('@/entities/settings', () => {
  const React = require('react');
  const { View, Text, Button, TouchableOpacity } = require('react-native');
  return {
    useSettings: jest.fn((selector: any) => {
      const state = {
        availablePlates: [10, 20],
        defaultBarWeight: 20,
        themeMode: 'system',
        motionPreference: 'system',
        hapticsEnabled: true,
        togglePlate: jest.fn(),
        setBarWeight: jest.fn(),
        setThemeMode: jest.fn(),
        setMotionPreference: jest.fn(),
        setHapticsEnabled: jest.fn(),
      };
      return selector ? selector(state) : state;
    }),
    useUser: jest.fn((selector: any) => {
      const state = { resetUser: jest.fn() };
      return selector ? selector(state) : state;
    }),
    useRestTimerSetting: jest.fn(() => ({
      restTimerInput: '90',
      setRestTimerInput: jest.fn(),
      restTimerSeconds: 90,
      applyRestTimerSeconds: jest.fn(),
      handleRestTimerInputChange: jest.fn(),
    })),
    SettingItem: ({ label, onPress }: any) => (
      <TouchableOpacity onPress={onPress} testID={`setting-item-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    SegmentedPicker: ({ label, value }: any) => (
      <View>
        <Text>{label}: {value}</Text>
      </View>
    ),
    STANDARD_PLATES: [10, 20],
    BAR_WEIGHTS: [20],
  };
});

jest.mock('@/shared/context/DIContext', () => ({
  useDI: jest.fn(() => ({
    wipeDatabase: { execute: jest.fn() },
  })),
}));

jest.mock('@/shared/ui', () => {
  const React = require('react');
  const { View, Text, Switch, TextInput, TouchableOpacity } = require('react-native');
  return {
    AppText: ({ children }: any) => <Text>{children}</Text>,
    AppIcon: () => null,
    Screen: ({ children }: any) => <View>{children}</View>,
    CardBase: ({ children }: any) => <View>{children}</View>,
    ToggleChip: ({ label, onPress, isActive }: any) => (
      <TouchableOpacity onPress={onPress} testID={`chip-${label}`}>
        <Text>{label} {isActive ? '(Active)' : ''}</Text>
      </TouchableOpacity>
    ),
    AppInput: (props: any) => <TextInput {...props} />,
  };
});

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el título y las secciones correctamente', () => {
    const { getByText } = render(<SettingsPage />);
    expect(getByText('Ajustes')).toBeTruthy();
    expect(getByText('PERFIL')).toBeTruthy();
    expect(getByText('EQUIPAMIENTO')).toBeTruthy();
    expect(getByText('APLICACIÓN')).toBeTruthy();
  });

  it('navega al perfil al presionar Perfil de Usuario', () => {
    const { getByText } = render(<SettingsPage />);
    fireEvent.press(getByText('Perfil de Usuario'));
    expect(router.push).toHaveBeenCalledWith('/settings/profile');
  });

  it('muestra la duración del timer de descanso', () => {
    const { getByText } = render(<SettingsPage />);
    expect(getByText('90s')).toBeTruthy();
  });

  it('confirma antes de resetear la base de datos', () => {
    const { getByText } = render(<SettingsPage />);
    const resetButton = getByText('Resetear Base de Datos');
    
    fireEvent.press(resetButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Resetear Base de Datos',
      expect.any(String),
      expect.any(Array)
    );
  });

  it('confirma antes de cerrar sesión', () => {
    const { getByText } = render(<SettingsPage />);
    const logoutButton = getByText('Cerrar Sesión');
    
    fireEvent.press(logoutButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Cerrar Sesión',
      '¿Estás seguro?',
      expect.any(Array)
    );
  });
});
