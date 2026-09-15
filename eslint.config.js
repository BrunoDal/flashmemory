import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({ ignores: ['dist/**', 'node_modules/**'] }, js.configs.recommended, ...tseslint.configs.recommended, {
  languageOptions: { globals: { self: 'readonly', caches: 'readonly', fetch: 'readonly', URL: 'readonly', console: 'readonly', process: 'readonly' } },
  rules: { '@typescript-eslint/no-explicit-any': 'off' }
}, { files: ['public/sw.js'], rules: { 'no-undef': 'off' } });
