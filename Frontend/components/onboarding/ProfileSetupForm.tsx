import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XStack, YStack, useTheme } from 'tamagui';

import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';

interface ProfileSetupFormProps {
  name: string;
  setName: (v: string) => void;
  gender: 'male' | 'female' | 'other' | '';
  setGender: (v: 'male' | 'female' | 'other') => void;
  age: string;
  setAge: (v: string) => void;
  onSubmit: () => void;
}

export function ProfileSetupForm({
  name,
  setName,
  gender,
  setGender,
  age,
  setAge,
  onSubmit,
}: ProfileSetupFormProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <YStack alignItems="center" gap="$md">
          <AppText variant="titleLg" textAlign="center">Bienvenido a GymApp</AppText>
          <AppText variant="bodyMd" color="textSecondary" textAlign="center">
            Completa tu perfil antes de empezar
          </AppText>

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
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <YStack
                    borderRadius="$md"
                    borderWidth={1}
                    borderColor={isSelected ? '$primary' : '$borderColor'}
                    backgroundColor={isSelected ? '$primarySubtle' : '$surfaceSecondary'}
                    paddingVertical={12}
                    alignItems="center"
                  >
                    <AppText
                      variant="bodyMd"
                      fontWeight={isSelected ? '700' : '500'}
                      color={isSelected ? 'primary' : 'textSecondary'}
                    >
                      {option === 'male' ? 'Hombre' : option === 'female' ? 'Mujer' : 'Otro'}
                    </AppText>
                  </YStack>
                </Pressable>
              );
            })}
          </XStack>

          <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />

          <AppButton label="Guardar perfil" onPress={onSubmit} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
