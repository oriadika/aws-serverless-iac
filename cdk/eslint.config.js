import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [

  {
    ignores: ["cdk.out/**", "**/*.d.ts", "jest.config.js", "test/**/*.js", "test/**/*.ts"],
  },

  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: new URL(".", import.meta.url),
        project: ["./tsconfig.json"],
        sourceType: "module",
      },
      globals: {
        URL: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginTypescript.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },


  {
    files: ["test/**/*.ts", "test/**/*.js"],
    languageOptions: {
      globals: {
        test: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
      },
    },
  },


  {
    files: ["jest.config.js"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
      },
    },
  },

  {
    rules: {
      ...prettier.rules,
    },
  },
];
