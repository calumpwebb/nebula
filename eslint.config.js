import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import nebulaPlugin from './packages/eslint-plugin-nebula/src/index.js'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/target/**',
      '**/_generated/**',
      '**/convex/_generated/**',
    ],
  },
  {
    plugins: {
      nebula: nebulaPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Allow triple-slash references for type declarations
      '@typescript-eslint/triple-slash-reference': [
        'error',
        { path: 'always', types: 'prefer-import', lib: 'always' },
      ],
      // Nebula custom rules
      'nebula/require-skip-auth-reason': 'error',
    },
  }
)
