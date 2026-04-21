const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,

  {
    ignores: ['dist/*', '.expo/**'],

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // 🔥 ENFORCEMENT DE ARQUITECTURA (VERSIÓN CORRECTA)
  {
    rules: {
      // ❗ obligatorio desactivar base rule
      'no-restricted-imports': 'off',

      '@typescript-eslint/no-restricted-imports': [
        'warn',
        {
          patterns: [
            // 🚫 NO deep imports dentro de features
            {
              group: [
                '@/features/**/components/*',
                '@/features/**/hooks/*',
                '@/features/**/utils/*',
                '@/features/**/store/*',
              ],
              message: 'Importa solo desde el index del feature',
            },

            // 🚫 NO usar internals de otros features
            {
              group: ['@/features/*/*'],
              message: 'Usa el public API del feature (index.ts)',
            },

            // 🚫 legacy utils (ya migrado a lib/domain)
            {
              group: ['@/utils/*'],
              message: 'Usa lib/ o domain/',
            },

            // 🚫 legacy components
            {
              group: ['@/components/*'],
              message: 'Usa ui/',
            },

            // 🚫 acceso directo a shared interno
            {
              group: ['@/../packages/shared/src/*'],
              message: 'Importa solo desde @shared',
            },

            // 🚫 evitar saltarse barrels en lib
            {
              group: ['@/lib/**/!index'],
              message: 'Importa desde el entrypoint de lib',
            },

            // 🚫 evitar saltarse barrels en domain
            {
              group: ['@/domain/**/!index'],
              message: 'Importa desde el entrypoint de domain',
            },
          ],
        },
      ],
    },
  },
]);