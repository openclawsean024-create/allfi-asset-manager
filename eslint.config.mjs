// ESLint 9 flat config for AllFi 資產管家 v2.0
// Next.js 16 + React 19 + TypeScript 5 + Tailwind 4
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "tests/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Response: "readonly",
        Request: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Math: "readonly",
        Date: "readonly",
        JSON: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        // React 19 + Next.js
        React: "readonly",
        JSX: "readonly",
        // Node test env
        process: "readonly",
        global: "readonly",
      },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-undef": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-prototype-builtins": "off",
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
