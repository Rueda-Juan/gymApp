module.exports = {
  preset: 'jest-expo',
  setupFiles: ['@react-native-async-storage/async-storage/jest/async-storage-mock'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js', '@react-native-async-storage/async-storage/jest/async-storage-mock'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@tamagui/core$': '<rootDir>/__mocks__/@tamagui_core_mock.js',
    '^tamagui$': '<rootDir>/__mocks__/tamagui.js',
    '^tamagui/(.*)$': '<rootDir>/__mocks__/tamagui.js',
    '^@react-native-async-storage/async-storage$': '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^zustand$': '<rootDir>/node_modules/zustand/index.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@kernel$': '<rootDir>/../packages/shared/src/index.ts',
    '^@kernel/(.*)$': '<rootDir>/../packages/shared/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts?(x)',
    '<rootDir>/src/**/*.int.test.ts?(x)'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|@tamagui|tamagui|lucide-react-native|victory|victory-native|zustand|@react-navigation|@shopify/flash-list)'
  ]
};
