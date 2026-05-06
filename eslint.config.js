import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import angularTemplateParser from '@angular-eslint/template-parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    // TypeScript files
    {
        files: ['**/*.ts'],
        ignores: ['**/node_modules/**', '**/dist/**', '**/*.js', '**/src/base/**'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json'],
                sourceType: 'module'
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            '@angular-eslint': angular,
            '@typescript-eslint': typescriptPlugin
        },
        rules: {
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'ase', style: 'kebab-case' }],
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'ase', style: 'camelCase' }],
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/require-await': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            '@typescript-eslint/no-explicit-any': 'error',
            eqeqeq: ['error', 'always'],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'no-eval': 'error',
            'no-var': 'error',
            'prefer-const': 'error'
        }
    },

    // Angular HTML template files
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: angularTemplateParser
        },
        plugins: {
            '@angular-eslint/template': angularTemplate
        },
        rules: {
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/eqeqeq': 'error'
        }
    }
];
