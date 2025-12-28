import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tickets: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal('backlog'),
      v.literal('in-progress'),
      v.literal('blocked'),
      v.literal('done')
    ),
  }),

  missions: defineTable({
    ticketId: v.optional(v.id('tickets')),
    phase: v.union(
      v.literal('brainstorm'),
      v.literal('design'),
      v.literal('plan'),
      v.literal('execute')
    ),
    status: v.union(
      v.literal('active'),
      v.literal('paused'),
      v.literal('completed'),
      v.literal('aborted')
    ),
  }),
})
