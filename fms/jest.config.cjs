const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Path to Next.js app to load next.config.js and .env files in the test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // transform: {
  //   "^.+\\.(t|j)sx?$": ["@swc/jest"],
  // },
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@pages/(.*)$": "<rootDir>/pages/$1",
    "^@constants/(.*)$": "<rootDir>/constants/$1",
    "^@avatar/(.*)$": "<rootDir>/assets/svg/Avatar/$1",
    "^@icons/(.*)$": "<rootDir>/assets/svg/Icons/$1",
    "^@illustrations/(.*)$": "<rootDir>/assets/svg/Illustrations/$1",
    "^@logo/(.*)$": "<rootDir>/assets/svg/Logo/$1",
    "^@services/(.*)$": "<rootDir>/services/$1",
    "^@type/(.*)$": "<rootDir>/type/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
