/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: false,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}