module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { unstable_transformImportMeta: true }], '@babel/preset-typescript'],
    plugins: [
      'babel-plugin-inline-import',
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/app': './src/app',
          '@/pages': './src/pages',
          '@/widgets': './src/widgets',
          '@/features': './src/features',
          '@/entities': './src/entities',
          '@/shared': './src/shared',
          '@/tamagui.config': './src/shared/config/tamagui.config.ts',
          '@shared': '../packages/shared/index.ts',
          '@shared/*': '../packages/shared/src/*',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};

