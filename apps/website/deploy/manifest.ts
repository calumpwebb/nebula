// apps/website/deploy/manifest.ts

import { app } from '../../../infra/lib'

export default app('nebula-website', {
  dockerfile: './Dockerfile',
  buildTarget: 'development',
  liveUpdate: ['./src'],
  env: {},
  labels: ['nebula'],
  portForwards: ['4321:4321'],
})
