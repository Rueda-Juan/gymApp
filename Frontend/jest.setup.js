// Jest setup: stable test env variables
process.env.EXPO_OS = process.env.EXPO_OS || 'android';
// Signal Tamagui internals to avoid RN-specific branches where tests don't run
process.env.TAMAGUI_DISABLE_RN = '1';
