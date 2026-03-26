const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// Since Backend and Frontend are siblings, the workspace root is one level up
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 0. Add support for .wasm files (required for expo-sqlite on web)
config.resolver.assetExts.push('wasm');

// 1. Watch all files in the workspace (including Backend)
config.watchFolders = [workspaceRoot];

// 2. Let Metro search in both project and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'Backend/node_modules'),
];

config.resolver.extraNodeModules = {
  'backend': path.resolve(workspaceRoot, 'Backend/src'),
  'expo-sqlite': path.resolve(projectRoot, 'node_modules/expo-sqlite'),
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'zod': path.resolve(projectRoot, 'node_modules/zod'),
  'date-fns': path.resolve(projectRoot, 'node_modules/date-fns'),
};

module.exports = config;
