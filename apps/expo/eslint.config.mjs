import baseConfig from "@stable/eslint-config/base";
import expoConfig from "@stable/eslint-config/expo";
import reactConfig from "@stable/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...expoConfig,
];
