import { query } from '../../_generated/server'
import { authComponent } from './index'

// Public query - anyone can check if they're logged in
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
