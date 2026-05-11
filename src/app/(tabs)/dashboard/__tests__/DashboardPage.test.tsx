import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import DashboardPage from '../index';
import { useUser } from '@/entities/settings';
import { useHomeData } from '@/features/dashboardSummary';
import { useActiveWorkout } from '@/entities/workout';

// Mocks
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
}));


jest.mock('@/shared/ui', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    AppText: ({ children, variant }: any) => <Text testID={`text-${variant}`}>{children}</Text>,
    AppButton: ({ label, onPress }: any) => (
      <TouchableOpacity onPress={onPress} testID={label}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
    AppIcon: () => null,
    PressableCard: ({ children, onPress, accessibilityLabel }: any) => (
      <TouchableOpacity onPress={onPress} testID={accessibilityLabel}>
        {children}
      </TouchableOpacity>
    ),
    CardBase: ({ children }: any) => <View>{children}</View>,
    AnimatedViewShared: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('@/features/home', () => {
  const { View, Text, Button } = require('react-native');
  return {
    HomeHeader: ({ userName, onEditProfile }: any) => (
      <View>
        <Text>{`Hola ${userName}`}</Text>
        <Button title="Edit Profile" onPress={onEditProfile} />
      </View>
    ),
    HomeCTA: ({ routineName, onContinue, onNewSession, onFreeSession, isActive }: any) => (
      <View>
        {isActive ? (
          <Button title={`Continuar ${routineName}`} onPress={onContinue} />
        ) : (
          <>
            <Button title="Nueva Sesión" onPress={onNewSession} />
            <Button title="Entreno Libre" onPress={onFreeSession} />
          </>
        )}
      </View>
    ),
    LastWorkoutCard: ({ onViewAll, onViewLast }: any) => (
      <View>
        <Button title="Ver Todo" onPress={onViewAll} />
        <Button title="Ver Último" onPress={onViewLast} />
      </View>
    ),
  };
});

jest.mock('@/shared/ui/feedback', () => {
  const { View } = require('react-native');
  return {
    ContentReveal: ({ children, loading, skeleton }: any) => (loading ? skeleton : children),
  };
});

jest.mock('@/shared/ui/layout/Loaders', () => {
  const { Text } = require('react-native');
  return {
    DashboardSkeleton: () => <Text>Cargando dashboard...</Text>,
  };
});

jest.mock('@/features/onboarding', () => {
  const { View, Text } = require('react-native');
  return {
    ProfileSetupForm: () => <View><Text>Configuración de Perfil</Text></View>,
  };
});

jest.mock('@/entities/workout', () => ({
  useActiveWorkout: jest.fn(),
  useLastPerformedLabel: jest.fn(() => () => 'Hace 2 días'),
}));

jest.mock('@/entities/settings', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/entities/stats', () => ({
  getWeeklyTrainingDays: jest.fn(() => [true, false, true, false, false, false, false]),
}));

jest.mock('@/entities/routine', () => ({
  useRoutineExercisesLabel: jest.fn(() => () => '4 ejercicios'),
}));

jest.mock('@/features/activeWorkout', () => ({
  useStartWorkout: jest.fn(() => jest.fn()),
}));

jest.mock('@/features/dashboardSummary', () => ({
  useHomeData: jest.fn(),
}));

describe('DashboardPage', () => {
  const mockUser = { id: '1', name: 'Juan' };
  const mockHomeData = {
    loading: false,
    data: {
      stats: { streak: 5, weeklyCount: 3 },
      routines: [{ id: 'r1', name: 'Pecho' }],
      history: [],
    },
    lastWorkout: { id: 'w1', date: new Date().toISOString() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as unknown as jest.Mock).mockImplementation((selector) => selector({ user: mockUser, setUser: jest.fn() }));
    (useHomeData as jest.Mock).mockReturnValue(mockHomeData);
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => selector({ isActive: false, routineName: '' }));
  });

  it('muestra el estado de carga del usuario si user es undefined', () => {
    (useUser as unknown as jest.Mock).mockImplementation((selector) => selector({ user: undefined }));
    const { getByText } = render(<DashboardPage />);
    expect(getByText('Cargando usuario...')).toBeTruthy();
  });

  it('muestra el formulario de configuración si el usuario no tiene nombre', () => {
    (useUser as unknown as jest.Mock).mockImplementation((selector) => selector({ user: { id: '1', name: '' }, setUser: jest.fn() }));
    const { getByText } = render(<DashboardPage />);
    expect(getByText('Configuración de Perfil')).toBeTruthy();
  });

  it('renderiza el dashboard correctamente cuando hay datos', async () => {
    const { getByText } = render(<DashboardPage />);
    
    expect(getByText('Hola Juan')).toBeTruthy();
    expect(getByText(/5/)).toBeTruthy(); // Streak
    expect(getByText(/3/)).toBeTruthy(); // Weekly count
    expect(getByText('Pecho')).toBeTruthy(); // Routine name
  });

  it('muestra skeleton mientras carga los datos del dashboard', () => {
    (useHomeData as jest.Mock).mockReturnValue({ ...mockHomeData, loading: true });
    const { getByText } = render(<DashboardPage />);
    expect(getByText('Cargando dashboard...')).toBeTruthy();
  });

  it('navega a las estadísticas al presionar las tarjetas de racha o semanales', () => {
    const { getByTestId } = render(<DashboardPage />);
    
    fireEvent.press(getByTestId('Ver estadísticas de racha'));
    expect(router.push).toHaveBeenCalledWith('/(tabs)/stats');

    fireEvent.press(getByTestId('Ver estadísticas semanales'));
    expect(router.push).toHaveBeenCalledWith('/(tabs)/stats');
  });

  it('navega a la creación de rutina si no hay rutinas guardadas', () => {
    (useHomeData as jest.Mock).mockReturnValue({
      ...mockHomeData,
      data: { ...mockHomeData.data, routines: [] },
    });
    
    const { getByTestId } = render(<DashboardPage />);
    fireEvent.press(getByTestId('Crear primera rutina'));
    
    expect(router.push).toHaveBeenCalledWith('/routine/create');
  });

  it('muestra el CTA de continuar si hay un entrenamiento activo', () => {
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) => selector({ isActive: true, routineName: 'Empuje' }));
    const { getByText } = render(<DashboardPage />);
    
    expect(getByText('Continuar Empuje')).toBeTruthy();
  });

  it('navega al perfil al presionar editar en el header', () => {
    const { getByText } = render(<DashboardPage />);
    fireEvent.press(getByText('Edit Profile'));
    
    expect(router.push).toHaveBeenCalledWith('/settings/profile');
  });
});
