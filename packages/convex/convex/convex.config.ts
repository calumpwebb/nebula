import { defineApp } from 'convex/server'
import betterAuth from '@convex-dev/better-auth/convex.config'
import rateLimiter from '@convex-dev/rate-limiter/convex.config'
import appVersionMiddleware from './lib/appVersionMiddleware'

const app: ReturnType<typeof defineApp> = defineApp()
app.use(betterAuth)
app.use(rateLimiter)
app.use(appVersionMiddleware)

export default app
