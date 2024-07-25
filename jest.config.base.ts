import type { Config } from '@jest/types';

// ts-jest - need 'ts-node'
export const baseJestConfig: Config.InitialOptions = {
  'preset': 'ts-jest',
  'clearMocks': true,
  'coverageDirectory': 'coverage',
  'testMatch': [
    '<rootDir>/tests/**/*.test.(ts|tsx)'
  ],
  'setupFiles': [
    '<rootDir>/tests/setupTests.ts'
  ]
}
