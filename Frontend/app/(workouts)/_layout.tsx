import React, { useEffect } from 'react';

import { Stack as ExpoStack } from 'expo-router';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { Alert } from 'react-native';

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
          gestureEnabled: false, // Force them to use the explicit 'Finish'/'Cancel' buttons
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
