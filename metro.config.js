const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Soporte para módulos modernos (requerido por algunas dependencias y router)
config.resolver.sourceExts.push('mjs');

// 2. Vigilar todo el monorepo
config.watchFolders = [workspaceRoot];

// 3. Buscar dependencias en todos los node_modules posibles
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'), // Clave: node_modules de la raíz
  path.resolve(workspaceRoot, 'Backend/node_modules'),
];

// 4. Forzar resolución estricta para dependencias compartidas
config.resolver.extraNodeModules = {
  'backend': path.resolve(workspaceRoot, 'Backend/src'),
  'expo-sqlite': path.resolve(projectRoot, 'node_modules/expo-sqlite'),
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'zod': path.resolve(projectRoot, 'node_modules/zod'),
  'date-fns': path.resolve(projectRoot, 'node_modules/date-fns'),
};

const isStorybookEnabled = process.env.STORYBOOK_ENABLED === 'true';

const finalConfig = isStorybookEnabled
  ? withStorybook(config, {
      configPath: path.resolve(projectRoot, 'src/.rnstorybook'),
    })
  : config;

module.exports = finalConfig;