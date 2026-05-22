/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Map Next.js path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    // Stub out Apollo and GraphQL imports — not needed for pure-logic tests
    '^@apollo/client(.*)$': '<rootDir>/src/__tests__/__mocks__/apollo.ts',
    '^graphql-ws$': '<rootDir>/src/__tests__/__mocks__/graphql-ws.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
};
