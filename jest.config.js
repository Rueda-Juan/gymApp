module.exports = {
  preset: 'jest-expo',

  setupFiles: [
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ],

  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js',
  ],

  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/entities(/.*)?$': '<rootDir>/src/shared/entities$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/tamagui\\.config$': '<rootDir>/src/shared/config/tamagui.config.ts',
    '^@/(.*)$': '<rootDir>/src/$1',

    // Monorepo
    '^@kernel$': '<rootDir>/src/shared/types/kernel.ts',

    // Async storage
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',

    // Worklets mock
    '^react-native-worklets-core$': '<rootDir>/__mocks__/react-native-worklets-core.js',
  },
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>/src'],

  testMatch: [
    '<rootDir>/src/**/*.test.ts?(x)',
    '<rootDir>/src/**/*.int.test.ts?(x)',
  ],

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|expo-router|@tamagui|tamagui|lucide-react-native|victory|victory-native|zustand|@react-navigation|@shopify/flash-list|react-native-reanimated)',
  ],
};