import React, { useState } from 'react';
import { Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XStack, YStack } from 'tamagui';

import { AppText } from '@/shared/ui/AppText';
import { AppInput } from '@/shared/ui/AppInput';
import { AppButton } from '@/shared/ui/AppButton';
import type { UserProfile } from '@/entities/settings';

const SAFE_AREA_STYLE = { flex: 1 } as const;
const SCROLL_CONTENT_STYLE = {
  flexGrow: 1,
  justifyContent: 'center' as const,
  paddingHorizontal: 20,
  paddingVertical: 20,
} as const;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Hombre' },
  { value: 'female', label: 'Mujer' },
  { value: 'other', label: 'Otro' },
] as const;

type Gender = 'male' | 'female' | 'other';

interface ProfileSetupFormProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export function ProfileSetupForm({ onComplete }: ProfileSetupFormProps) {

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [age, setAge] = useState('');

  // Solo letras, espacios y acentos
  const nameRegex = /^[A-Za-zÀÈÎÓÚáéíóúññÜ\s]+$/;

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Datos incompletos', 'Por favor, ingresa tu nombre.');
      return;
    }
    if (!nameRegex.test(trimmedName)) {
      Alert.alert('Nombre inválido', 'El nombre solo puede contener letras, espacios y acentos.');
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (!age.trim() || isNaN(parsedAge)) {
      Alert.alert('Edad inválida', 'Por favor, ingresa tu edad.');
      return;
    }
    if (parsedAge < 1 || parsedAge > 120) {
      Alert.alert('Edad inválida', 'La edad debe estar entre 1 y 120 años.');
      return;
    }
    onComplete({
      name: trimmedName,
      gender: gender || 'other',
      age: parsedAge,
      createdAt: Date.now(),
    });
  };

  return (
    <SafeAreaView style={SAFE_AREA_STYLE}>
      <ScrollView contentContainerStyle={SCROLL_CONTENT_STYLE}>
        <YStack alignItems="center" gap="$md">
          <AppText variant="titleLg" textAlign="center">Bienvenido a GymApp</AppText>
          <AppText variant="bodyMd" color="textSecondary" textAlign="center">
            Completa tu perfil antes de empezar
          </AppText>

          <AppInput placeholder="Nombre" value={name} onChangeText={setName} autoFocus />

          <AppText variant="label" color="textSecondary">Sexo / Género</AppText>
          <XStack gap="$sm">
            {GENDER_OPTIONS.map(({ value, label }) => {
              const isSelected = gender === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setGender(value)}
                  style={{ flex: 1 }}
                  accessibilityRole="radio"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: isSelected }}
                >
                  <YStack
                    borderRadius="$md"
                    borderWidth={1}
                    borderColor={isSelected ? '$primary' : '$borderColor'}
                    backgroundColor={isSelected ? '$primarySubtle' : '$surfaceSecondary'}
                    paddingVertical="$sm"
                    alignItems="center"
                  >
                    <AppText
                      variant="bodyMd"
                      fontWeight={isSelected ? '700' : '500'}
                      color={isSelected ? 'primary' : 'textSecondary'}
                    >
                      {label}
                    </AppText>
                  </YStack>
                </Pressable>
              );
            })}
          </XStack>

          <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />

          <AppButton label="Guardar perfil" onPress={handleSubmit} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
