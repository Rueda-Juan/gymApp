
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import ErrorState from '../../components/shared/ErrorState';

import { useRouter } from 'expo-router';
import { ROUTES } from '../../constants/routes';

const SettingsScreen = () => {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  React.useEffect(() => {
    setTimeout(() => {
      setState('success');
    }, 1000);
  }, []);

  const router = useRouter();

  if (state === 'loading') return <LoadingSkeleton />;
  if (state === 'error') return <ErrorState message="Error al cargar ajustes" />;

  // success
  return (
    <ScrollView>
      <Text>Ajustes</Text>
      <Text style={{ color: 'blue' }} onPress={() => router.push(ROUTES.TABS)}>
        Volver al dashboard
      </Text>
    </ScrollView>
  );
};

export default SettingsScreen;
