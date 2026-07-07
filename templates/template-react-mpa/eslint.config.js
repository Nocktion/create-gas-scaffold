import eslint from '@eslint/js';
import googleappsscript from 'eslint-plugin-googleappsscript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const config = [
  { ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.es2022,
        ...globals.browser,
        ...googleappsscript.environments.googleappsscript.globals,
      },
    },
    plugins: {
      unicorn,
      googleappsscript,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-undef': 'error',
      'no-redeclare': ['error', { builtinGlobals: false }],
      eqeqeq: 'error',
      'no-throw-literal': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/error-message': 'error',
      'unicorn/prefer-string-slice': 'warn',
      'unicorn/no-array-for-each': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];

export default config;
