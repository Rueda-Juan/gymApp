import React from 'react';
import { Stack as ExpoStack } from 'expo-router';
import { useActiveWorkout } from '@/store/useActiveWorkout';

export default function WorkoutsLayout() {
  const isActive = useActiveWorkout(state => state.isActive);

  return (
    <ExpoStack
      screenOptions={{
        headerShown: false,
        gestureEnabled: !isActive, 
        animation: 'slide_from_bottom',
      }}
    >
      <ExpoStack.Screen 
        name="[active]" 
        options={{
          title: 'Entrenamiento Activo',
          gestureEnabled: false,
        }} 
      />
      
      {/* Modals for Bottom Sheets (transparent backgrounds) */}
      <ExpoStack.Screen 
        name="exercise-browser" 
        options={{ 
          presentation: 'transparentModal',
          animation: 'fade',
        }} 
      />
      <ExpoStack.Screen 
        name="rest-timer" 
        options={{ 
          presentation: 'transparentModal',
          animation: 'fade',
        }} 
      />
    </ExpoStack>
  );
}