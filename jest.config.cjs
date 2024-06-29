// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/tests/jest/styleMock.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
}
