import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Better Auth component manages its own tables (user, session, account, verification)
// Add your application tables here

export default defineSchema({
  threads: defineTable({
    userId: v.string(),
    title: v.union(v.string(), v.null()),
  }).index('by_user', ['userId']),

  messages: defineTable({
    threadId: v.id('threads'),
    userId: v.string(),
    content: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
  }).index('by_thread', ['threadId']),
})
