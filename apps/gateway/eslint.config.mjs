import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      sonarjs: sonarjsPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
        },
      ],
      'comma-dangle': ['error', 'only-multiline'],
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          pathGroups: [
            { group: 'external', pattern: '@nestjs/**', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['nestjs'],
        },
      ],
      'max-lines-per-function': ['error', { skipBlankLines: true, max: 75 }],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-return-await': 'error',
      'no-fallthrough': 'warn',
      'no-useless-return': 'error',
      'object-shorthand': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'never', next: 'if', prev: 'if' },
        { blankLine: 'always', next: ['block-like', 'const', 'export', 'let', 'return', 'throw'], prev: '*' },
        { blankLine: 'always', next: '*', prev: ['block-like', 'const', 'let'] },
        { blankLine: 'never', next: 'const', prev: 'const' },
        { blankLine: 'never', next: 'let', prev: 'let' },
        { blankLine: 'always', next: '*', prev: ['multiline-const', 'multiline-let'] },
      ],
      'prefer-const': 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreDeclarationSort: true,
          memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      yoda: 'error',
      'sonarjs/no-duplicate-string': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['.'],
        },
      },
    },
  },
);
