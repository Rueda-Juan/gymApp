import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from '@/tamagui.config';

const mockCreateCustomExercise = jest.fn().mockResolvedValue(undefined);
const mockRouterBack = jest.fn();

jest.mock('@/hooks/domain/useExercises', () => ({
  useExercises: () => ({ createCustomExercise: mockCreateCustomExercise }),
}));

jest.mock('react-native-toast-message', () => ({ __esModule: true, default: { show: jest.fn() } }));

jest.mock('expo-haptics', () => ({
  __esModule: true,
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));

jest.mock('expo-router', () => ({ router: { back: mockRouterBack } }));

// Mock the composed UI pieces to avoid relying on Tamagui internals in this integration test.
jest.mock('@/app/exercise/CreateExerciseForm', () => {
  const React = require('react');
  const { View, TextInput, Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => {
      const { name, setName, togglePrimaryMuscle, handleSetEquipment } = props;
      return React.createElement(View, null,
        React.createElement(TextInput, { placeholder: 'Nombre del ejercicio', value: name, onChangeText: setName, accessibilityLabel: 'Nombre del ejercicio' }),
        React.createElement(Pressable, { onPress: () => togglePrimaryMuscle('chest'), accessibilityLabel: 'Pecho' }, React.createElement(Text, null, 'Pecho')),
        React.createElement(Pressable, { onPress: () => handleSetEquipment('dumbbell'), accessibilityLabel: 'Mancuernas' }, React.createElement(Text, null, 'Mancuernas'))
      );
    }
  };
});

jest.mock('@/app/exercise/CreateExerciseHeader', () => ({ __esModule: true, default: () => null }));
jest.mock('@/app/exercise/CreateExerciseFooter', () => ({ __esModule: true, default: (props: any) => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  const { onSave, isSaving } = props;
  return React.createElement(Pressable, { onPress: onSave, accessibilityLabel: 'Guardar ejercicio', disabled: isSaving }, React.createElement(Text, null, isSaving ? 'Guardando...' : 'Guardar ejercicio'));
}}));

jest.mock('@/components/ui/Screen', () => ({ __esModule: true, Screen: ({ children }: any) => children }));

import CreateExerciseScreen from '@/app/exercise/create';

const renderWithProviders = (component: React.ReactElement) => render(
  <SafeAreaProvider
    initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
  >
    <TamagiProviderWrapper>
      {component}
    </TamagiProviderWrapper>
  </SafeAreaProvider>
);

function TamagiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {children}
    </TamaguiProvider>
  );
}

describe('CreateExercise integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits form and calls createCustomExercise', async () => {

    const { getByPlaceholderText, getByText } = renderWithProviders(<CreateExerciseScreen />);

    const nameInput = getByPlaceholderText('Nombre del ejercicio');
    fireEvent.changeText(nameInput, 'Press de pecho');

    // Select primary muscle (Pecho)
    const chestChip = getByText('Pecho');
    fireEvent.press(chestChip);

    // Select equipment (Mancuernas)
    const dumbbellChip = getByText('Mancuernas');
    fireEvent.press(dumbbellChip);

    // Press save
    const saveBtn = getByText('Guardar ejercicio');
    fireEvent.press(saveBtn);

    await waitFor(() => expect(mockCreateCustomExercise).toHaveBeenCalledTimes(1));

    expect(mockCreateCustomExercise).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Press de pecho',
      primaryMuscles: expect.arrayContaining(['chest']),
      equipment: 'dumbbell',
    }));
  });
});
