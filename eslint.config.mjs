import js from '@eslint/js'
import globals from 'globals'
import config from 'eslint-config-prettier'
import plugin from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

/** @type {import('eslint').Linter.Config[]} */

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        config,
        plugin,
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.browser },
    },
])
