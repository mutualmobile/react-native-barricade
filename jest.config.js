module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__/data/'],
  setupFiles: ['<rootDir>/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?)/)',
  ],
  coverageThreshold: {
    global: {
      lines: 99,
    },
  },
};
