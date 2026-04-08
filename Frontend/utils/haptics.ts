import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function triggerLightHaptic(): void {
  if (Platform.OS !== 'web') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function triggerMediumHaptic(): void {
  if (Platform.OS !== 'web') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export function triggerSelectionHaptic(): void {
  if (Platform.OS !== 'web') {
    void Haptics.selectionAsync();
  }
}

export function triggerSuccessHaptic(): void {
  if (Platform.OS !== 'web') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
