# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Project Nebula is a developer HUD for AI-assisted coding. TypeScript monorepo with:
- **Convex** - Real-time backend (local self-hosted)
- **Temporal** - Workflow orchestration for missions
- **Tauri** - Desktop app (not yet set up)

## Commands

```bash
just up      # Start Docker (Temporal + Convex) + app code
just down    # Stop everything
just clean   # Delete Docker volumes (fresh start)

just check   # Type-check all packages
just lint    # Lint everything
just test    # Run tests
just build   # Production build
```

## Architecture

```
apps/
  desktop/     # Tauri + React (placeholder)
  worker/      # Temporal worker (mission workflows)

packages/
  convex/      # Convex backend (schema, queries, mutations)
  shared/      # Shared TypeScript types + utilities
```

## Key Patterns

- **Enums over magic strings** - Use TypeScript enums for status fields
- **@nebula/shared** - Import shared types: `import { Ticket, TicketStatus } from '@nebula/shared'`
- **Convex types** - Generated at runtime. Run `just up` before type-checking convex.

## Convex + Temporal Integration

- Desktop → Convex: User actions via mutations
- Convex → Temporal: Kick off workflows via HTTP actions
- Temporal → Convex: Activities update state via mutations
- Convex → Desktop: Real-time subscriptions

## Development Notes

- Convex generates `_generated/` files when running. Type-check skips convex until generated.
- Temporal worker connects to `localhost:7233` (Docker)
- Convex local backend runs on `localhost:3210` (Docker)
