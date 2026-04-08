module.exports = {
  preset: 'jest-expo',
  setupFiles: ['@react-native-async-storage/async-storage/jest/async-storage-mock'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-native-reanimated$': require.resolve('react-native-reanimated/mock'),
    '^@tamagui/core$': '<rootDir>/node_modules/tamagui/dist/test.cjs',
    '^tamagui$': 'tamagui/native-test',
    '^tamagui/(.*)$': '@tamagui/$1',
    '^@react-native-async-storage/async-storage$': '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@tamagui|tamagui|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))'
  ]
};
