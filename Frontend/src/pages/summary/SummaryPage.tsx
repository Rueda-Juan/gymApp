


import React from 'react';
import { Screen } from '@/shared/ui/Screen';
import { AppText } from '@/shared/ui/AppText';
import { AppButton } from '@/shared/ui/AppButton';
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

  if (state === SummaryScreenState.LOADING) return <LoadingSkeleton />;
  if (state === SummaryScreenState.ERROR) return <ErrorState message={errorMessage || "Error al cargar resumen"} />;

  // success
  return (
    <Screen scroll safeAreaEdges={['top','bottom','left','right']}>
      <AppText variant="titleMd" marginBottom="$lg">Resumen de sesión</AppText>
      {children}
      <AppButton
        label="Volver al dashboard"
        appVariant="ghost"
        onPress={() => router.push('/(tabs)')}
        marginTop="$2xl"
      />
    </Screen>
  );
};

export default SummaryScreen;
