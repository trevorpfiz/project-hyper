import baseConfig, { restrictEnvAccess } from "@hyper/eslint-config/base";
import nextjsConfig from "@hyper/eslint-config/nextjs";
import reactConfig from "@hyper/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
