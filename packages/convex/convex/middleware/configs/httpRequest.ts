import type { HttpMiddlewareConfig } from '../types'

export const httpRequest: HttpMiddlewareConfig = {
  name: 'httpRequest',
  server: {
    handle: async (request, { functionName }) => {
      console.info(`[HTTP] ${request.method} ${functionName}`)
      return { request }
    },
  },
}
