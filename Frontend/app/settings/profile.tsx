import React from 'react';
import { Pressable, Alert } from 'react-native';
import { YStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { useUser } from '@/store/useUser';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const user = useUser((s) => s.user);
  const setUser = useUser((s) => s.setUser);

  const [name, setName] = React.useState(user.name || '');
  const [gender, setGender] = React.useState(user.gender || 'other');
  const [age, setAge] = React.useState(user.age?.toString() || '');

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <YStack paddingHorizontal="$lg" paddingTop="$lg" gap="$md">
        <AppText variant="titleLg">Perfil</AppText>
        <AppText variant="bodySm" color="textSecondary">Administra tus datos personales</AppText>

        <AppInput placeholder="Nombre" value={name} onChangeText={setName} />
        <AppInput placeholder="Sexo" value={gender} onChangeText={(value) => setGender(value as 'male' | 'female' | 'other')} />
        <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />

        <AppButton
          label="Guardar"
          onPress={() => {
            if (!name.trim()) {
              Alert.alert('Atención', 'El nombre es obligatorio.');
              return;
            }
            setUser({ name: name.trim(), gender: gender as any, age: Number(age) || null, createdAt: user.createdAt || Date.now() });
            Alert.alert('Listo', 'Tu perfil ha sido actualizado.');
          }}
        />

        <Pressable onPress={() => router.back()}>
          <AppText variant="bodyMd" color="primary">Volver</AppText>
        </Pressable>
      </YStack>
    </Screen>
  );
}
