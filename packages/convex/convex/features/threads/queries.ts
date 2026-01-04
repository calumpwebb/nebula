import { v } from 'convex/values'
import { query } from '../../functions'

export const getThreads = query({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.db
      .query('threads')
      .withIndex('by_user', (q) => q.eq('userId', ctx.user._id))
      .order('desc')
      .collect()

    return threads
  },
}) as unknown

export const getThread = query({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId)

    if (!thread || thread.userId !== ctx.user._id) {
      return null
    }

    return thread
  },
}) as unknown

export const getMessages = query({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    // Verify thread belongs to user
    const thread = await ctx.db.get(args.threadId)
    if (!thread || thread.userId !== ctx.user._id) {
      return []
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
      .order('asc')
      .collect()

    return messages
  },
}) as unknown
