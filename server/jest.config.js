module.exports = {
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '.',
        outputName: 'test-results.xml',
      },
    ],
  ],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
};
