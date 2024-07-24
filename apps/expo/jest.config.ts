import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts", "<rootDir>/setup.ts"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
  ],
  moduleFileExtensions: ["js", "ts", "tsx"],
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|superjson))`,
  ],
  coverageReporters: ["json-summary", ["text", { file: "coverage.txt" }]],
  reporters: [
    "default",
    ["github-actions", { silent: false }],
    "summary",
    [
      "jest-junit",
      {
        outputDirectory: "coverage",
        outputName: "jest-junit.xml",
        ancestorSeparator: " › ",
        uniqueOutputName: "false",
        suiteNameTemplate: "{filepath}",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
      },
    ],
  ],
  coverageDirectory: "<rootDir>/coverage/",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
