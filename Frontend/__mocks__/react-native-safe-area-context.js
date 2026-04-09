const React = require('react');

function SafeAreaProvider({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function SafeAreaView({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function useSafeAreaInsets() {
  return { top: 0, left: 0, right: 0, bottom: 0 };
}

module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
};
