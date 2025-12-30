// apps/desktop/deploy/manifest.ts

import { localApp } from '../../../infra/lib'

export default localApp('nebula-desktop', {
  cmd: 'pnpm tauri dev',
  labels: ['nebula'],
  resourceDeps: ['convex-backend', 'nebula-worker'],
})
