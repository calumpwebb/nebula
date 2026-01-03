# Convex Middleware Infrastructure

Bulletproof client/server middleware system for injecting hidden args, auth, metrics, and logging.

## Goals

- Single source of truth for middleware configs
- Hidden plumbing (app version, auth, metrics) invisible to callers
- Type-safe: `skipAuth: true` → no `ctx.user`
- Enforcement: ESLint + package boundaries + runtime logging
- No accidental public endpoints

## File Structure

```
packages/convex/
├── convex/
│   ├── _generated/
│   ├── features/                    # Domain logic
│   │   ├── auth/
│   │   │   └── queries.ts
│   │   └── updates/
│   │       └── http.ts
│   ├── middleware/
│   │   ├── configs/                 # Shared configs (pure data, no imports)
│   │   │   ├── appVersion.ts
│   │   │   ├── auth.ts
│   │   │   └── httpRequest.ts
│   │   ├── types.ts
│   │   ├── factory.ts
│   │   └── server.ts                # Exports query, mutation, action, httpAction
│   ├── lib/
│   │   └── rateLimiter.ts
│   ├── schema.ts
│   ├── http.ts
│   └── convex.config.ts
├── client/
│   └── index.ts                     # Exports useQuery, useMutation
└── package.json
```

## Middleware Config Pattern

Each middleware is defined once, works for both client and server:

```typescript
// convex/middleware/configs/appVersion.ts
// ⚠️  PURE CONFIG - No runtime imports allowed here
// This file is imported by both server and client middleware.

import type { MiddlewareConfig } from '../types'

export const appVersion: MiddlewareConfig<
  { _appVersion: string }, // TInject (client)
  string | undefined, // TExtract (server)
  Record<string, never>, // TCtxAdditions
  '_appVersion' // TStrip
> = {
  name: 'appVersion',
  client: {
    inject: () => ({
      _appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev',
    }),
  },
  server: {
    extract: (args) => args._appVersion as string | undefined,
    handle: (value, { ctx, functionName }) => {
      console.info(`[${functionName}] client version: ${value ?? 'unknown'}`)
      return { ctx }
    },
    stripFromArgs: ['_appVersion'],
  },
}
```

## Auth Middleware with skipAuth

```typescript
// convex/middleware/configs/auth.ts
import type { MiddlewareConfig } from '../types'
import type { User } from '../../lib/types'

export const auth: MiddlewareConfig<
  Record<string, never>,
  boolean | undefined,
  { user: User },
  'skipAuth'
> = {
  name: 'auth',
  client: null,
  server: {
    extract: (args) => args.skipAuth as boolean | undefined,
    handle: async (skipAuth, { ctx, functionName }) => {
      if (skipAuth) {
        console.info(`[AUTH SKIPPED] ${functionName}`)
        return { ctx }
      }
      const user = await getAuthUser(ctx)
      if (!user) throw new Error('Unauthorized')
      return { ctx: { ...ctx, user } }
    },
    stripFromArgs: ['skipAuth'],
  },
}
```

## Types

```typescript
// convex/middleware/types.ts
import type { GenericQueryCtx } from 'convex/server'
import type { DataModel } from '../_generated/dataModel'

// Client config
type ClientConfig<TInject extends Record<string, unknown>> = {
  inject: () => TInject
  afterResponse?: (args: TInject, durationMs: number) => void
}

// Server config
type ServerConfig<
  TExtract,
  TCtxAdditions extends Record<string, unknown> = Record<string, never>,
  TStrip extends string = never,
> = {
  extract: (args: Record<string, unknown>) => TExtract
  handle: (
    value: TExtract,
    context: { ctx: GenericQueryCtx<DataModel>; functionName: string }
  ) =>
    | Promise<{ ctx: GenericQueryCtx<DataModel> & TCtxAdditions }>
    | { ctx: GenericQueryCtx<DataModel> & TCtxAdditions }
  afterHandler?: (value: TExtract, durationMs: number) => void
  stripFromArgs: TStrip[]
}

// Combined
export type MiddlewareConfig<
  TInject extends Record<string, unknown> = Record<string, unknown>,
  TExtract = unknown,
  TCtxAdditions extends Record<string, unknown> = Record<string, never>,
  TStrip extends string = never,
> = {
  name: string
  client: ClientConfig<TInject> | null
  server: ServerConfig<TExtract, TCtxAdditions, TStrip> | null
}

// HTTP middleware (httpAction only)
export type HttpMiddlewareConfig = {
  name: string
  server: {
    handle: (
      request: Request,
      context: { functionName: string }
    ) => Promise<{ request: Request; ctx?: Record<string, unknown> }>
  }
}
```

## Factory

```typescript
// convex/middleware/factory.ts
import { customQuery, customMutation, customAction } from 'convex-helpers/server/customFunctions'
import type { MiddlewareConfig } from './types'

export function createMiddleware(input: MiddlewareInput): Middleware {
  const config = { args: {}, input }
  return {
    query: (base) => customQuery(base, config),
    mutation: (base) => customMutation(base, config),
    action: (base) => customAction(base, config),
  }
}

export function buildMiddleware<TConfig extends MiddlewareConfig>(config: TConfig) {
  return {
    server: config.server ? buildServerMiddleware(config) : null,
    client: config.client ? buildClientMiddleware(config) : null,
  }
}
```

## Composition

```typescript
// convex/middleware/server.ts
// ⚠️  SERVER ONLY - Do not import React or client code here

import { buildMiddleware } from './factory'
import { appVersion } from './configs/appVersion'
import { auth } from './configs/auth'
import {
  query as baseQuery,
  mutation as baseMutation,
  action as baseAction,
} from '../_generated/server'

// Middleware runs top-to-bottom
const configs = [appVersion, auth] as const

const middleware = configs.map((c) => buildMiddleware(c).server).filter(Boolean)

export const query = middleware.reduce((acc, mw) => mw!.query(acc), baseQuery)
export const mutation = middleware.reduce((acc, mw) => mw!.mutation(acc), baseMutation)
export const action = middleware.reduce((acc, mw) => mw!.action(acc), baseAction)
```

```typescript
// client/index.ts
// ⚠️  CLIENT ONLY - Do not import Convex server internals here

import { buildMiddleware } from '../convex/middleware/factory'
import { appVersion } from '../convex/middleware/configs/appVersion'
import { useQuery as baseUseQuery, useMutation as baseUseMutation } from 'convex/react'

const configs = [appVersion] as const

const middleware = configs.map((c) => buildMiddleware(c).client).filter(Boolean)

export const useQuery = middleware.reduce((acc, mw) => mw!.useQuery(acc), baseUseQuery)
export const useMutation = middleware.reduce((acc, mw) => mw!.useMutation(acc), baseUseMutation)
```

## Conditional Auth Types

`skipAuth: true` means no `ctx.user`:

```typescript
// Overload 1: skipAuth: true → BaseCtx (no user)
export function query<Args extends { skipAuth: true }>(config: {
  skipAuth: true
  args: ArgsValidator
  handler: (ctx: BaseCtx, args: Infer<ArgsValidator>) => Promise<Result>
}): QueryFunction

// Overload 2: no skipAuth → AuthenticatedCtx (has user)
export function query<Args>(config: {
  args: ArgsValidator
  handler: (ctx: AuthenticatedCtx, args: Infer<ArgsValidator>) => Promise<Result>
}): QueryFunction
```

## Handler DX

```typescript
// convex/features/users/queries.ts
import { query } from '../../middleware/server'
import { v } from 'convex/values'

// Authenticated by default
export const me = query({
  args: {},
  handler: async (ctx) => {
    return ctx.user // ✅ TypeScript knows this exists
  },
})

// @skip-auth-reason: Public profile for sharing
export const publicProfile = query({
  skipAuth: true,
  args: { username: v.string() },
  handler: async (ctx, args) => {
    // ctx.user would be TypeScript error here
    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('username'), args.username))
      .first()
  },
})
```

```typescript
// apps/desktop/src/components/Profile.tsx
import { useQuery } from '@nebula/convex/client'
import { api } from '@nebula/convex'

export function Profile() {
  const user = useQuery(api.features.users.queries.me, {})
  // _appVersion injected automatically
  if (!user) return <Loading />
  return <div>{user.email}</div>
}
```

## Enforcement

### 1. Package exports

```json
// packages/convex/package.json
{
  "exports": {
    ".": "./convex/_generated/api.js",
    "./client": "./client/index.js",
    "./server": "./convex/middleware/server.js"
  }
}
```

`_generated/server` not exported - forces use of middleware.

### 2. ESLint rules

```javascript
// .eslintrc.js
rules: {
  'no-restricted-imports': ['error', {
    patterns: [
      { group: ['convex/react'], message: 'Import from @nebula/convex/client instead' },
      { group: ['*/_generated/server'], message: 'Import from middleware/server instead' }
    ]
  }],
  '@nebula/require-skip-auth-reason': 'error'
}
```

### 3. ESLint rule: require-skip-auth-reason

```typescript
// packages/eslint-plugin-nebula/rules/require-skip-auth-reason.ts
export const requireSkipAuthReason: Rule.RuleModule = {
  meta: {
    type: 'problem',
    messages: {
      missingReason:
        'skipAuth: true requires a @skip-auth-reason comment above the export.\n' +
        'Example:\n' +
        '  // @skip-auth-reason: Health check for load balancer\n' +
        '  export const health = query({ skipAuth: true, ... })',
    },
  },
  create(context) {
    return {
      Property(node) {
        if (node.key.name === 'skipAuth' && node.value.value === true) {
          // Find parent export, check for @skip-auth-reason comment
          // Report error if missing
        }
      },
    }
  },
}
```

### 4. Runtime logging

```typescript
if (skipAuth) {
  console.info(`[AUTH SKIPPED] ${functionName}`)
}
```

## httpAction Middleware

Separate pattern for raw HTTP endpoints:

```typescript
// convex/middleware/configs/httpRequest.ts
export const httpRequest: HttpMiddlewareConfig = {
  name: 'httpRequest',
  server: {
    handle: async (request, { functionName }) => {
      console.info(`[HTTP] ${request.method} ${functionName}`)
      return { request }
    },
  },
}
```

## Migration

| File                                   | Action                                                              |
| -------------------------------------- | ------------------------------------------------------------------- |
| `convex/auth.ts`                       | Move `getCurrentUser` to `features/auth/queries.ts`, use middleware |
| `convex/updates.ts`                    | Move to `features/updates/http.ts`                                  |
| `convex/lib/middleware/appVersion.ts`  | Refactor to unified config                                          |
| `apps/desktop/src/lib/convex.ts`       | Move to `packages/convex/client/`                                   |
| `convex/lib/middleware/rateLimiter.ts` | Move to `convex/lib/rateLimiter.ts` (not middleware)                |
