module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".next/",
    ".turbo/",
    ".expo/",
    "coverage/",
    "next-env.d.ts",
    "**/*.test.{js,jsx,ts,tsx}",
    "__tests__/",
    "test/",
    "tests/",
  ],
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",

    // General JavaScript rules
    "no-unused-vars": "off", // Handled by @typescript-eslint/no-unused-vars
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
    "no-undef": "off", // Handled by TypeScript
  },
  overrides: [
    // Config files - more relaxed rules
    {
      files: [
        "*.config.{js,mjs,cjs,ts}",
        "tailwind.config.{js,ts}",
        "postcss.config.{js,mjs}",
        "{next,turbo,babel}.config.{js,mjs,cjs,ts}",
      ],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
