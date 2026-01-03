import type { MiddlewareConfig } from '../types'
import { authComponent } from '../../auth'

export const auth: MiddlewareConfig<
  Record<string, never>,
  boolean | undefined,
  { user: Awaited<ReturnType<typeof authComponent.getAuthUser>> },
  'skipAuth'
> = {
  name: 'auth',
  client: null,
  server: {
    extract: (args) => args.skipAuth as boolean | undefined,
    handle: async (skipAuth, { ctx, functionName }) => {
      if (skipAuth) {
        console.info(`[AUTH SKIPPED] ${functionName}`)
        // When skipping auth, we still need to return the correct type shape
        // but without adding the user property
        return {
          ctx: ctx as typeof ctx & { user: Awaited<ReturnType<typeof authComponent.getAuthUser>> },
        }
      }
      const user = await authComponent.getAuthUser(ctx)
      if (!user) throw new Error('Unauthorized')
      return { ctx: { ...ctx, user } }
    },
    stripFromArgs: ['skipAuth'],
  },
}
