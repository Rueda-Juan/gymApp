import { YStack } from 'tamagui';
import { Link } from 'expo-router';
import { AppText } from '@/components/ui/AppText';

export default function ModalScreen() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$xl">
      <AppText variant="titleLg">Modal</AppText>
      <Link href="/" dismissTo>
        <YStack marginTop="$lg" paddingVertical="$lg">
          <AppText variant="bodyMd" color="primary" fontWeight="600">Ir al inicio</AppText>
        </YStack>
      </Link>
    </YStack>
  );
}
