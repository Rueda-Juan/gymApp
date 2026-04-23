const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const fsdPlugin = require('@conarti/eslint-plugin-feature-sliced');

module.exports = [
  {
    ignores: ['dist/*', '.expo/**', 'node_modules/**', '**/__tests__/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'feature-sliced': fsdPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'feature-sliced/layers-slices': 'error',
      'feature-sliced/absolute-relative': 'error',
      'feature-sliced/public-api': 'error',
      'no-restricted-imports': 'off',
    },
  },
];