import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('missions').collect()
  },
})

export const create = mutation({
  args: {
    ticketId: v.optional(v.id('tickets')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('missions', {
      ticketId: args.ticketId,
      phase: 'brainstorm',
      status: 'active',
    })
  },
})
