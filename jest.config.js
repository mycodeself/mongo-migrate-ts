module.exports = {
  modulePathIgnorePatterns: ['__mocks__'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
};
