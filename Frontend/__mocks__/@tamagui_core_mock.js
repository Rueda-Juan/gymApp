module.exports = {
  __esModule: true,
  createTamagui: (cfg) => ({ ...(cfg || {}) }),
  createTokens: (t) => (t || {}),
  createFont: (f) => (f || {}),
};
