module.exports = {
  modulePathIgnorePatterns: ['__mocks__'],
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
};
