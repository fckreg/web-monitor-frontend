import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    plugins: {
      "@stylistic": stylistic,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      react,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Formatting / spacing (elk-compatible)
      // Без `export` в prev: иначе конфликт с simple-import-sort/exports в barrel-файлах.
      "@stylistic/padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: ["multiline-block-like", "return", "multiline-expression", "switch", "try"],
        },
        {
          blankLine: "always",
          prev: ["multiline-block-like", "multiline-expression", "switch", "try"],
          next: "*",
        },
      ],

      // Imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        },
      ],
      "import/no-default-export": "error",
      "import/prefer-default-export": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
              message: "Запрещён дефолтный импорт React; используйте именованные импорты.",
            },
          ],
        },
      ],

      // Best practices
      "no-console": [
        "error",
        {
          allow: ["warn", "error", "info", "groupCollapsed", "groupEnd"],
        },
      ],
      "no-alert": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsFor: [
            "acc",
            "accumulator",
            "e",
            "ctx",
            "context",
            "req",
            "request",
            "res",
            "response",
            "$scope",
            "staticContext",
            "draft",
          ],
        },
      ],
      // Кодбаза на function declarations (компоненты/утилиты); elk expression не навязываем.
      "func-style": "off",
      "no-plusplus": "off",

      // React
      "react/jsx-key": "error",
      "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "warn",
      "react/no-array-index-key": "error",
      // component-props — только кастомные компоненты; dom-props — нативные теги (div и т.д.)
      "react/forbid-component-props": [
        "warn",
        {
          forbid: ["style"],
        },
      ],
      "react/forbid-dom-props": [
        "warn",
        {
          forbid: ["style"],
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // A11y
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/img-redundant-alt": "error",
    },
  },
  {
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "proxy.ts",
      "**/*.config.{js,mjs,cjs,ts}",
      "playwright.config.ts",
      "vitest.config.ts",
      "next.config.ts",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    // OG ImageResponse и CSS Anchor Positioning требуют inline styles
    files: ["**/og-image.tsx", "**/opengraph-image.tsx", "**/chart-values.tsx"],
    rules: {
      "react/forbid-component-props": "off",
      "react/forbid-dom-props": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
    },
  },
  // Отключает правила, конфликтующие с Prettier.
  eslintConfigPrettier,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    rules: {
      curly: ["error", "all"],
    },
  },
);
