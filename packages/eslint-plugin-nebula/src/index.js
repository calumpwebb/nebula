// Note: JS not TS because eslint.config.js is loaded by Node directly
import { requireSkipAuthReason } from './rules/require-skip-auth-reason.js'

const plugin = {
  meta: {
    name: 'eslint-plugin-nebula',
    version: '0.0.1',
  },
  rules: {
    'require-skip-auth-reason': requireSkipAuthReason,
  },
  configs: {
    recommended: {
      plugins: ['nebula'],
      rules: {
        'nebula/require-skip-auth-reason': 'error',
      },
    },
  },
}

export default plugin
