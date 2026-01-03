// ⚠️  PURE CONFIG - No runtime imports allowed here
// This file is imported by both server and client middleware.

import type { MiddlewareConfig } from '../types'

export const appVersion: MiddlewareConfig<
  { _appVersion: string }, // TInject (client)
  string | undefined, // TExtract (server)
  Record<string, never>, // TCtxAdditions
  '_appVersion' // TStrip
> = {
  name: 'appVersion',
  client: {
    inject: () => ({
      _appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev',
    }),
  },
  server: {
    extract: (args) => args._appVersion as string | undefined,
    handle: (value, { ctx, functionName }) => {
      console.info(`[${functionName}] client version: ${value ?? 'unknown'}`)
      // Return ctx with explicit intersection to satisfy type checker
      return { ctx: ctx as typeof ctx & Record<string, never> }
    },
    stripFromArgs: ['_appVersion'],
  },
}
