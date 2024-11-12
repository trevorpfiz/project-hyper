import baseConfig, { restrictEnvAccess } from "@stable/eslint-config/base";
import nextjsConfig from "@stable/eslint-config/nextjs";
import reactConfig from "@stable/eslint-config/react";

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
