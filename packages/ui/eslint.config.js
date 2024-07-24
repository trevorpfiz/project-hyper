import baseConfig from "@hyper/eslint-config/base";
import reactConfig from "@hyper/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
