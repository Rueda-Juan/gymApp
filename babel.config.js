module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      ["babel-plugin-inline-import", { extensions: [".sql"] }],
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@kernel": "./src/shared/types/kernel.ts",
          },
        },
      ],
      // Reanimated plugin ya carga internamente react-native-worklets/plugin.
      // NO agregar react-native-worklets-core/plugin por separado.
      // DEBE IR ÚLTIMO. INNEGOCIABLE.
      ...(process.env.NODE_ENV !== "test"
        ? ["react-native-reanimated/plugin"]
        : []),
    ],
  };
};
