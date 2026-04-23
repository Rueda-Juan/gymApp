const React = require('react');
const RN = require('react-native');

module.exports = {
  __esModule: true,
  TamaguiProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  ThemeProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  XStack: RN.View,
  YStack: RN.View,
  Stack: RN.View,
  Text: RN.Text,
  Input: RN.TextInput,
  // A lightweight Button shim that maps layout props like `flex` into style
  Button: ({ children, flex, style, testID, ...props }) => {
    // normalize style to a plain object for tests that expect object shape
    const baseStyle = Array.isArray(style) ? Object.assign({}, ...style) : (style || {});
    const mergedStyle = { ...baseStyle, ...(flex != null ? { flex } : {}) };
    return React.createElement(RN.Pressable, { testID, style: mergedStyle, ...props }, children);
  },
  ScrollView: RN.ScrollView,
  Paragraph: RN.Text,
  styled: (c) => c,
  useTheme: () => ({ primary: { val: '#B5530A' }, color: { val: '#000' }, background: { val: '#fff' } }),
  createFont: (config) => config,
  createTokens: (config) => config,
  createTamagui: (config) => config,
};

