

import React from 'react';
import { Text, ScrollView, Pressable } from 'react-native';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';
import { useRouter } from 'expo-router';

const SummaryScreenState = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;
type SummaryScreenStateType = typeof SummaryScreenState[keyof typeof SummaryScreenState];

function useSummaryScreenState(initial: SummaryScreenStateType = SummaryScreenState.LOADING) {
  const [state, setState] = React.useState<SummaryScreenStateType>(initial);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setState(SummaryScreenState.SUCCESS);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return state;
}

type SummaryScreenProps = {
  loadingMessage?: string;
  errorMessage?: string;
  children?: React.ReactNode;
};

const SummaryScreen = ({ loadingMessage, errorMessage, children }: SummaryScreenProps) => {
  const state = useSummaryScreenState();
  const router = useRouter();

  // LoadingSkeleton does not accept children; loadingMessage is ignored for now
  if (state === SummaryScreenState.LOADING) return <LoadingSkeleton />;
  if (state === SummaryScreenState.ERROR) return <ErrorState message={errorMessage || "Error al cargar resumen"} />;

  // success
  return (
    <ScrollView>
      <Text>Resumen de sesión</Text>
      {children}
      <Pressable
        onPress={() => router.push('/(tabs)')}
        accessibilityRole="button"
        accessibilityLabel="Volver al dashboard"
      >
        <Text style={{ color: 'blue' }}>Volver al dashboard</Text>
      </Pressable>
    </ScrollView>
  );
};

export default SummaryScreen;
