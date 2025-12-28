# Project Nebula: Repository Setup Design

## Overview

Fresh TypeScript monorepo for Nebula - a developer HUD for AI-assisted coding. Structured for parallel team development.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: Convex (local, self-hosted) for real-time data
- **Workflows**: Temporal for complex mission orchestration
- **Desktop**: Tauri + React (placeholder for now)
- **Shared**: TypeScript types and utilities

## Folder Structure

```
project-nebula/
├── apps/
│   ├── desktop/              # Tauri + React (placeholder)
│   │   └── package.json
│   │
│   └── worker/               # Temporal worker
│       ├── src/
│       │   ├── workflows/
│       │   ├── activities/
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── convex/               # Convex backend
│   │   ├── convex/
│   │   │   ├── schema.ts
│   │   │   └── ...
│   │   ├── convex.json
│   │   └── package.json
│   │
│   └── shared/               # Shared TypeScript
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
│
├── docker-compose.yml        # Temporal + Convex local
├── justfile                  # Commands
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── .eslintrc.js
```

## Commands

Seven commands, that's it:

```bash
just up      # Start Docker (Temporal + Convex) + app code
just down    # Stop everything
just clean   # Stop + delete all Docker volumes

just check   # Type-check all packages
just lint    # Lint everything
just test    # Run all tests
just build   # Production build
```

## Package Imports

Shared types imported as `@nebula/shared`:

```typescript
// packages/shared/src/types/tickets.ts
export enum TicketStatus {
  Backlog = 'backlog',
  InProgress = 'in_progress',
  Blocked = 'blocked',
  Done = 'done',
}

export interface Ticket {
  id: string
  title: string
  status: TicketStatus
}
```

```typescript
// In any app or package
import { Ticket, TicketStatus } from '@nebula/shared'
```

## Convex + Temporal Integration

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Desktop   │ ──── │   Convex    │ ──── │  Temporal   │
│    (UI)     │      │  (realtime) │      │  (workflow) │
└─────────────┘      └─────────────┘      └─────────────┘
```

- Desktop → Convex: User actions via mutations
- Convex → Temporal: Kick off workflows via HTTP actions
- Temporal → Convex: Activities update state via mutations
- Convex → Desktop: Real-time subscriptions

## Initial Scope

**Working code:**
- Root config (pnpm, turbo, tsconfig, eslint, prettier)
- `justfile` with all 7 commands
- `docker-compose.yml` (Temporal + Convex local backend)
- `packages/shared` with placeholder types
- `packages/convex` with schema stub
- `apps/worker` with Temporal setup + example workflow

**Placeholder only:**
- `apps/desktop` - package.json + README

**Enables parallel work:**
- Person A: Convex schema + functions
- Person B: Temporal workflows
- Person C: Desktop app setup
