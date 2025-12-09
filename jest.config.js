module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts"
  ],

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  moduleFileExtensions: ["ts", "js", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text-summary"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
