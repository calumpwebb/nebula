# Threads Chat Interface Design

**Date:** 2026-01-04
**Status:** Approved

## Overview

Redesign the home page with a ChatGPT-inspired interface featuring personalized greeting, chat input, and thread-based conversations. Adds thread management with history view.

## Data Model

### Database Schema (Convex)

**threads table:**

- `_id`: auto-generated
- `userId`: reference to user who created it
- `title`: string, nullable (future: editable titles)
- `_creationTime`: auto-generated timestamp

**messages table:**

- `_id`: auto-generated
- `threadId`: reference to parent thread
- `userId`: who sent the message
- `content`: message text
- `role`: "user" | "assistant" (future: AI responses)
- `_creationTime`: auto-generated timestamp

## Routing Structure

- `/` - Home page (greeting + input)
- `/settings` - Settings page (existing, keep)
- `/threads` - Thread history list page (new)
- `/threads/{threadId}` - Individual thread view with messages (new)
- Auth pages (login, signup, etc.) - keep existing

Remove all other unused pages.

## Home Page Design

### Visual Layout (Centered)

- Black gradient orb/sphere at top (decorative)
- "Good [morning/afternoon/evening], [Name]" - large text
- "What's on your mind?" - secondary text in purple/accent color
- Text input field with placeholder "Ask AI a question or make a request..."
- Clean, minimal styling

### Time-based Greeting

- 5am-11:59am: "Good morning"
- 12pm-4:59pm: "Good afternoon"
- 5pm-4:59am: "Good evening"

### User Name Source

Pull from `session.user.name` via `authClient.useSession()`. Fallback to "there" if unavailable.

### Interaction Flow

1. User types message and submits (Enter or send button)
2. Create new thread via Convex mutation
3. Create first message in that thread
4. Navigate to `/threads/{newThreadId}`

## Thread View Page

### Layout

- Standard page with sidebar
- Messages in chronological order
- User messages: simple styling with name and content
- Assistant messages: placeholder for now (future: AI responses)
- Timestamps on messages
- Input field fixed at bottom for continuing conversation

### Creating Messages

1. User types in bottom input
2. Submit creates new message via Convex mutation
3. Message appears in feed
4. Input clears

## Threads List Page

### Layout

- Standard page with sidebar
- Page title: "Threads"
- List of threads sorted by most recent first

### Thread List Items

- Preview: first 50 chars of first message (acts as title for now)
- Timestamp of creation
- Click navigates to `/threads/{threadId}`

### Empty State

"No threads yet. Start a conversation from the home page."

### Sidebar Navigation

Add new "Threads" item with chat/message icon.

## Convex API

### Mutations

1. **createThread**
   - Args: none (user from `ctx.user`)
   - Returns: thread ID

2. **createMessage**
   - Args: `{ threadId, content }`
   - Uses `ctx.user.id` for userId
   - Sets role to "user"
   - Returns: message ID

### Queries

1. **getThreads**
   - Args: none (user from `ctx.user`)
   - Returns: user's threads sorted desc by creation time

2. **getThread**
   - Args: `{ threadId }`
   - Validates thread belongs to `ctx.user`
   - Returns: thread data

3. **getMessages**
   - Args: `{ threadId }`
   - Validates thread belongs to `ctx.user`
   - Returns: messages sorted chronologically

All functions use existing auth middleware (automatic authentication via `ctx.user`).

## Error Handling

### Input Validation

- No blank/whitespace-only messages
- Thread ownership validated in all queries
- Disable submit when input empty

### Error States

- Network errors: inline message below input
- Thread not found: redirect to home or 404
- Unauthorized: handled by auth middleware

### UI Polish

- Loading states during mutations
- Input clears after successful send
- Empty state on threads list

## Future Enhancements

- AI assistant responses (integrate Claude API)
- Editable thread titles
- Thread deletion
- Search threads
- Optimistic UI updates
