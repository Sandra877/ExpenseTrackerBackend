import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Automatically look for test files
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts"
  ],

  // Better mocking behavior
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  // Allows TS + node imports
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // Generate coverage reports
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text-summary"],

  // You can exclude Node modules from coverage
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
};

export default config;
