/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Map Next.js path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    // Stub out Apollo and GraphQL imports — not needed for pure-logic tests
    '^@apollo/client(.*)$': '<rootDir>/src/__tests__/__mocks__/apollo.ts',
    // Only enums are needed from the generated client in unit tests.
    '^@generated$': '<rootDir>/src/__tests__/__mocks__/generated.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};
