import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTheme } from 'tamagui';

// A 64x64 transparent static noise PNG encoded in base64.
// This imparts a "physical material" brushed steel / carbon feel to dark mode backgrounds.
const NOISE_PATTERN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEUAAAAxMTEwMDAvLy8uLi4tLS0sLCwrKysqKiopKSkoKCgnJycmJiYlJSUkJCQjIyMiIiIhISEgICAfHx8eHh4dHR0cHBwbGxsZGRkYGBgXFxcWFhYVFRUUFBQTExMSEhIREREQEBAPDw8ODg4NDQ0MDAwLCwsKCgoJCQkICAwHBwcGBgYFBQUEREREhEMDAwLCwoDAwMEAgIHAID/AAEA/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/A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';

export function TextureOverlay() {
  const theme = useTheme();
  
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
      <Image
        source={{ uri: NOISE_PATTERN }}
        style={[StyleSheet.absoluteFill, { opacity: 0.08 }]}
        resizeMode="repeat"
      />
      {/* Sutil viñeta industrial para dar profundidad al "Acero" */}
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: 'transparent',
            borderWidth: 0,
            opacity: 0.15
          }
        ]} 
      />
    </View>
  );
}
