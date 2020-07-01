module.exports = {
  testEnvironment: 'node',
  roots: [ '<rootDir>/tests' ],
  setupFiles: [ '<rootDir>/tests/setup.js' ],
  "collectCoverageFrom": [
    "<rootDir>/src/**/*.js",
    "!**/node_modules/**",
  ],
  testTimeout: 30000
};