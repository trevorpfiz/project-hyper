import baseConfig from "@hyper/eslint-config/base";
import expoConfig from "@hyper/eslint-config/expo";
import reactConfig from "@hyper/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...expoConfig,
];
