import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**'], // Ignore node_modules
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'], // Specify file extensions
    languageOptions: {
      parser: typescriptParser,
      sourceType: 'module',
      ecmaVersion: 2021,
    },
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      'prettier/prettier': 'error', // Enforce Prettier rules
      // '@typescript-eslint/no-unused-vars': [
      //   'error',
      //   { argsIgnorePattern: '^_' },
      // ], // Handle unused variables
    },
  },
];
