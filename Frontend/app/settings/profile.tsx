import React from 'react';
import { Pressable, Alert, ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { useUser } from '@/store/useUser';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const user = useUser((s) => s.user);
  const setUser = useUser((s) => s.setUser);

  const [name, setName] = React.useState(user?.name || '');
  const [gender, setGender] = React.useState<'male' | 'female' | 'other'>(user?.gender || 'other');
  const [age, setAge] = React.useState(user?.age?.toString() || '');

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}>
        <YStack gap="$md">
          <AppText variant="titleLg">Perfil</AppText>
          <AppText variant="bodySm" color="textSecondary">Administra tus datos personales</AppText>

          <AppInput placeholder="Nombre" value={name} onChangeText={setName} />

          <AppText variant="label" color="textSecondary">Sexo / Género</AppText>
          <XStack gap="$sm">
            {(['male', 'female', 'other'] as const).map((option) => {
              const isSelected = gender === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setGender(option)}
                  style={{ flex: 1 }}
                  accessibilityRole="radio"
                  accessibilityLabel={option === 'male' ? 'Hombre' : option === 'female' ? 'Mujer' : 'Otro'}
                  accessibilityState={{ selected: isSelected }}
                >
                  <YStack
                    borderRadius="$md"
                    borderWidth={1}
                    borderColor={isSelected ? '$primary' : '$borderColor'}
                    backgroundColor={isSelected ? '$primarySubtle' : '$surfaceSecondary'}
                    paddingVertical="$md"
                    alignItems="center"
                  >
                    <AppText variant="bodyMd" fontWeight={isSelected ? '700' : '500'} color={isSelected ? 'primary' : 'textSecondary'}>
                      {option === 'male' ? 'Hombre' : option === 'female' ? 'Mujer' : 'Otro'}
                    </AppText>
                  </YStack>
                </Pressable>
              );
            })}
          </XStack>

          <AppInput
            placeholder="Edad"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          <AppButton
            label="Guardar"
            onPress={() => {
              if (!name.trim()) {
                Alert.alert('Atención', 'El nombre es obligatorio.');
                return;
              }
              const ageNum = Number(age);
              if (age.trim() && (isNaN(ageNum) || ageNum < 1 || ageNum > 120)) {
                Alert.alert('Atención', 'La edad debe estar entre 1 y 120 años.');
                return;
              }
              const initializedCreatedAt = user.createdAt ?? Date.now();
              setUser({ name: name.trim(), gender, age: ageNum || null, createdAt: initializedCreatedAt });
              Alert.alert('Listo', 'Tu perfil ha sido actualizado.');
            }}
          />

          <Pressable onPress={() => router.back()}>
            <AppText variant="bodyMd" color="primary">Volver</AppText>
          </Pressable>
        </YStack>
      </ScrollView>
    </Screen>
  );
}
