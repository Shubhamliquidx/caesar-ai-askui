module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Support both lowercase and uppercase test filenames
  testMatch: ['**/test/**/*.test.ts', '**/test/**/*.TEST.TS'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 60000,
  maxWorkers: 1
};
