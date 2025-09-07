import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/*.test.{ts,tsx}",
      "**/test/**",
    ],
  },
  {
    rules: {
      // Allow unused variables that start with underscore
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      // Allow any types in test files and utilities
      "@typescript-eslint/no-explicit-any": ["warn", {
        ignoreRestArgs: true
      }],
      // Allow unescaped entities in JSX (common in content)
      "react/no-unescaped-entities": "off",
      // Allow require in configuration files
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
