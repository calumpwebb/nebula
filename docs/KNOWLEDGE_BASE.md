# Nebula Knowledge Base

Quick index to detailed documentation.

## Architecture
TypeScript monorepo: Tauri desktop, Convex backend, Temporal workflows, k3d infra.
-> `docs/architecture.md`

## Development
k3d + Tilt environment, commands, adding services, troubleshooting.
-> `docs/development.md`

## Code Patterns
Enums over strings, shared types, Convex schema conventions, Temporal patterns.
-> `docs/patterns.md`

## Agent Workflow
bd (beads) issue tracking, AI agent protocols, planning document management.
-> `AGENTS.md`

## Design Documents

### Brainstorm Log
86 pins captured, mission phases, entity design, UI/UX exploration.
-> `docs/brainstorms/nebula-brainstorm-log.md`

### cdk8s Infrastructure (Current)
cdk8s manifest generation replacing raw YAML.
-> `docs/plans/2025-12-29-cdk8s-infra-design.md`
-> `docs/plans/2025-12-29-cdk8s-infra-implementation.md`

### Better Auth Setup
Authentication system design.
-> `docs/plans/2025-01-01-better-auth-setup.md`

### k3d + Tilt Setup
Infrastructure design: cluster, services, dependencies.
-> `docs/plans/2025-12-28-k3d-tilt-dev-environment.md`
-> `docs/plans/2025-12-28-k3d-tilt-implementation.md`

### Initial Repo Setup
Monorepo structure, package organization.
-> `docs/plans/2025-12-27-project-nebula-repo-setup-design.md`

## UI/Design

### Figma Guidelines
Design system, component library documentation.
-> `docs/figma/guidelines/Guidelines.md`
-> `docs/figma/README.md`

## Quick Reference

### Mission Phases
Brainstorm -> Design -> Plan -> Execute

### Ticket States
Backlog -> InProgress -> Done (or Blocked)

### Key Ports
| Service | Port |
|---------|------|
| Tilt UI | 10350 |
| Temporal UI | 8080 |
| Convex Dashboard | 6791 |
| Convex Backend | 3210 |
| Temporal gRPC | 7233 |
