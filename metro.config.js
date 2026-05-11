const { getDefaultConfig } = require("expo/metro-config");
const {
  withStorybook,
} = require("@storybook/react-native/metro/withStorybook");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Soporte para módulos modernos y archivos de base de datos
config.resolver.sourceExts.push("mjs", "sql");

const isStorybookEnabled = process.env.STORYBOOK_ENABLED === "true";

const finalConfig = isStorybookEnabled
  ? withStorybook(config, {
      configPath: path.resolve(projectRoot, "src/.rnstorybook"),
    })
  : config;

module.exports = finalConfig;
