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
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};

