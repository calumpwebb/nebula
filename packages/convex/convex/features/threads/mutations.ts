import { v } from 'convex/values'
import { mutation } from '../../functions'

export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const threadId = await ctx.db.insert('threads', {
      userId: ctx.user._id,
      title: null,
    })

    return threadId
  },
}) as unknown

export const createMessage = mutation({
  args: {
    threadId: v.id('threads'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify thread belongs to user
    const thread = await ctx.db.get(args.threadId)
    if (!thread || thread.userId !== ctx.user._id) {
      throw new Error('Thread not found')
    }

    const messageId = await ctx.db.insert('messages', {
      threadId: args.threadId,
      userId: ctx.user._id,
      content: args.content,
      role: 'user',
    })

    return messageId
  },
}) as unknown
