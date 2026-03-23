import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
      perfectionist: perfectionistPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // general
      'no-alert': 'off',
      camelcase: 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-restricted-exports': 'off',
      'no-promise-executor-return': 'off',
      'import/prefer-default-export': 'off',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      // typescript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
      // react
      'react/no-children-prop': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-array-index-key': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/jsx-no-duplicate-props': ['warn', { ignoreCase: false }],
      // react-hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // jsx-a11y
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      // unused imports
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'off',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      // perfectionist
      'perfectionist/sort-exports': ['warn', { order: 'asc', type: 'line-length' }],
      'perfectionist/sort-named-imports': ['warn', { order: 'asc', type: 'line-length' }],
      'perfectionist/sort-named-exports': ['warn', { order: 'asc', type: 'line-length' }],
      'perfectionist/sort-imports': [
        'warn',
        {
          order: 'asc',
          type: 'line-length',
          groups: [
            'style',
            'type',
            ['builtin', 'external'],
            'custom-mui',
            'custom-routes',
            'custom-hooks',
            'custom-utils',
            'internal',
            'custom-components',
            'custom-sections',
            'custom-auth',
            'custom-types',
            ['parent', 'sibling', 'index'],
            'unknown',
          ],
          customGroups: [
            { groupName: 'custom-mui', anyOf: [{ elementNamePattern: '^@mui/' }] },
            { groupName: 'custom-auth', anyOf: [{ elementNamePattern: '^src/auth/' }] },
            { groupName: 'custom-hooks', anyOf: [{ elementNamePattern: '^src/hooks/' }] },
            { groupName: 'custom-utils', anyOf: [{ elementNamePattern: '^src/utils/' }] },
            { groupName: 'custom-types', anyOf: [{ elementNamePattern: '^src/types/' }] },
            { groupName: 'custom-routes', anyOf: [{ elementNamePattern: '^src/routes/' }] },
            { groupName: 'custom-sections', anyOf: [{ elementNamePattern: '^src/sections/' }] },
            { groupName: 'custom-components', anyOf: [{ elementNamePattern: '^src/components/' }] },
          ],
        },
      ],
    },
  },
);
