module.exports = {
  preset: 'jest-expo',
  setupFiles: ['@react-native-async-storage/async-storage/jest/async-storage-mock'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js', '@react-native-async-storage/async-storage/jest/async-storage-mock'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^@tamagui/core$': '<rootDir>/__mocks__/@tamagui_core_mock.js',
    '^tamagui$': '<rootDir>/__mocks__/tamagui.js',
    '^tamagui/(.*)$': '<rootDir>/__mocks__/tamagui.js',
    '^@react-native-async-storage/async-storage$': '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^zustand$': '<rootDir>/node_modules/zustand/index.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^@shared$': '<rootDir>/../packages/shared/src/index.ts',
    '^@shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.test.ts?(x)',
    '<rootDir>/__tests__/**/*.int.test.ts?(x)'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@tamagui|tamagui|zustand|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))'
  ]
};
