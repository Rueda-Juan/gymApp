import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import LogWeightPage from '../LogWeightPage';

// Mocks
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});

jest.mock('@/entities/settings', () => ({
  useUser: jest.fn((selector: any) => {
    const state = { user: { id: 'user-123' } };
    return selector ? selector(state) : state.user;
  }),
}));

const mockLogBodyWeight = jest.fn();
jest.mock('@/entities/stats', () => ({
  useBodyWeight: jest.fn(() => ({
    logBodyWeight: mockLogBodyWeight,
  })),
  useStatsData: jest.fn(() => ({
    loading: false,
    stats: { weeklyStats: [] },
    weightHistory: [],
    summaries: [],
    trainedDates: [],
  })),
}));

describe('LogWeightPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente los elementos básicos', () => {
    const { getByText, getByPlaceholderText } = render(<LogWeightPage />);
    expect(getByText('Registrar Peso')).toBeTruthy();
    expect(getByPlaceholderText('0.0')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('muestra error si el peso es inválido', async () => {
    const { getByText, getByPlaceholderText } = render(<LogWeightPage />);
    const input = getByPlaceholderText('0.0');
    const saveButton = getByText('Guardar');

    fireEvent.changeText(input, '999'); // Mayor a 500
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('peso válido'));
    expect(mockLogBodyWeight).not.toHaveBeenCalled();
  });

  it('llama al servicio y vuelve atrás al guardar un peso válido', async () => {
    mockLogBodyWeight.mockResolvedValueOnce({});
    const { getByText, getByPlaceholderText } = render(<LogWeightPage />);
    const input = getByPlaceholderText('0.0');
    const saveButton = getByText('Guardar');

    fireEvent.changeText(input, '75.5');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockLogBodyWeight).toHaveBeenCalledWith(expect.objectContaining({
        weight: 75.5,
        userId: 'user-123',
      }));
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('muestra error si el servicio falla', async () => {
    mockLogBodyWeight.mockRejectedValueOnce(new Error('Failed'));
    const { getByText, getByPlaceholderText } = render(<LogWeightPage />);
    const input = getByPlaceholderText('0.0');
    const saveButton = getByText('Guardar');

    fireEvent.changeText(input, '75.5');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo guardar el peso');
    });
  });

  it('vuelve atrás al presionar el botón cerrar (X)', () => {
    const { getByLabelText } = render(<LogWeightPage />);
    const closeButton = getByLabelText('Cerrar');
    
    fireEvent.press(closeButton);
    
    expect(router.back).toHaveBeenCalled();
  });
});
