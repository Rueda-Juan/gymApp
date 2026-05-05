module.exports = {
  Worklets: {
    createRunOnJS: (fn) => fn,
    createContext: () => ({}),
  },
};
