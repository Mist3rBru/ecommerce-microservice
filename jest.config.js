module.exports = {
  bail: true,
  roots: ['<rootDir>/__tests__'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts',],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest']
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/__tests__/$1',
    '@/(.*)': '<rootDir>/$1'
  },
  testPathIgnorePatterns: ['mock*']
}