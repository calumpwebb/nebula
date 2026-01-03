import { httpRouter } from 'convex/server'
import { authComponent, createAuth } from './auth'
import { latest } from './updates'

const http = httpRouter()

// Register Better Auth routes with CORS for cross-domain requests
authComponent.registerRoutes(http, createAuth, { cors: true })

// Desktop app update check proxy
http.route({
  path: '/updates/latest.json',
  method: 'GET',
  handler: latest,
})

export default http
