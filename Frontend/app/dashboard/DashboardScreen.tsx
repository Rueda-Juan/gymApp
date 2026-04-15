import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useDashboardStore } from '../../hooks/application/useDashboardStore';
import { useNetworkState } from '../../hooks/application/useNetworkState';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import EmptyState from '../../components/shared/EmptyState';
import ErrorState from '../../components/shared/ErrorState';
import OfflineBanner from '../../components/shared/OfflineBanner';
import StatCard from '../../components/shared/StatCard';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';

type StreakSectionProps = { streakData: number };
const StreakSection = React.memo(function StreakSection({ streakData }: StreakSectionProps) {
  return <StatCard label="Streak" value={streakData || 0} />;
});

type ActionsSectionProps = {
  onStartWorkout: () => void;
  onViewRoutines: () => void;
  onViewStats: () => void;
};
const ActionsSection = React.memo(function ActionsSection({ onStartWorkout, onViewRoutines, onViewStats }: ActionsSectionProps) {
  return (
    <>
      <PrimaryButton
        title="Comenzar Entrenamiento"
        onPress={onStartWorkout}
      />
      <PrimaryButton
        title="Ver Rutinas"
        onPress={onViewRoutines}
      />
      <PrimaryButton
        title="Ver Estadísticas"
        onPress={onViewStats}
      />
    </>
  );
});
// Simulación de analytics
const logEvent = (event: string, params?: Record<string, any>) => {
  // Aquí iría la integración real (Firebase, Segment, etc.)
  console.log('Analytics event:', event, params);
};


function useDashboardScreenState(isOnline: boolean, user: any) {
  const [state, setState] = useState<'loading' | 'empty' | 'error' | 'success' | 'offline' | 'refreshing'>('loading');
  React.useEffect(() => {
    setTimeout(() => {
      if (!isOnline) setState('offline');
      else if (!user) setState('empty');
      else setState('success');
    }, 1000);
  }, [isOnline, user]);
  return [state, setState] as const;
}

const DashboardScreen = () => {
  const { user, streakData } = useDashboardStore();
  const { isOnline } = useNetworkState();
  const router = useRouter();
  const [state, setState] = useDashboardScreenState(isOnline, user);

  // Memoized handlers
  const handleStartWorkout = React.useCallback(() => {
    logEvent('start_workout', { source: 'dashboard' });
    router.push({ pathname: '/(workouts)/[active]', params: { active: 'sessionId' } });
  }, [router]);

  const handleViewRoutines = React.useCallback(() => {
    router.push(ROUTES.ROUTINES);
  }, [router]);

  const handleViewStats = React.useCallback(() => {
    router.push(ROUTES.STATS);
  }, [router]);

  const handleRefresh = React.useCallback(() => {
    setState('refreshing');
  }, [setState]);

  if (state === 'loading') return <LoadingSkeleton />;
  if (state === 'offline') return <OfflineBanner />;
  if (state === 'error') return <ErrorState message="Error al cargar dashboard" />;
  if (state === 'empty') return <EmptyState message="Crea tu primera rutina" />;

  // success
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={state === 'refreshing'} onRefresh={handleRefresh} />}>
      <StreakSection streakData={streakData ?? 0} />
      <ActionsSection
        onStartWorkout={handleStartWorkout}
        onViewRoutines={handleViewRoutines}
        onViewStats={handleViewStats}
      />
      {/* Agregar más UI según contrato */}
    </ScrollView>
  );
}

export default DashboardScreen;


