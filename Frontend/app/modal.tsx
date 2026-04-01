import { YStack } from 'tamagui';
import { Link } from 'expo-router';
import { useTheme } from '@tamagui/core';
import { AppText } from '@/components/ui/AppText';

export default function ModalScreen() {
  const theme = useTheme();

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor={theme.background?.val} padding="$xl">
      <AppText variant="titleLg">Modal</AppText>
      <Link href="/" dismissTo style={{ marginTop: 15, paddingVertical: 15 }}>
        <AppText variant="bodyMd" color="primary" fontWeight="600">Ir al inicio</AppText>
      </Link>
    </YStack>
  );
}
