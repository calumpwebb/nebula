# Pre-commit Hooks Design

**Ticket:** NEBULA-r4k
**Date:** 2025-12-31
**Status:** Draft

## Overview

Add pre-commit hooks for linting, formatting, type-checking, and commit message validation.

## Requirements

1. Format TypeScript/JavaScript files with Prettier
2. Lint TypeScript files with ESLint
3. Format Rust files with cargo fmt
4. Type-check the entire project
5. Validate commit messages follow conventional commits with required NEBULA ticket(s)

### Commit Message Format

```
type(NEBULA-xxx): description
type(NEBULA-xxx, NEBULA-yyy): description
```

Valid types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `build`

Examples:
- `feat(NEBULA-r4k): add pre-commit hooks`
- `fix(NEBULA-123, NEBULA-456): resolve race condition`

## Architecture

### Dependencies

| Package | Purpose |
|---------|---------|
| husky | Git hooks management |
| lint-staged | Run tools on staged files only |

### File Structure

```
.husky/
├── pre-commit        # Orchestrates all pre-commit checks
└── commit-msg        # Validates commit message format

scripts/
└── verify-commit-msg.sh  # Commit message validation logic
```

### Hook Flow

```
git commit
    │
    ▼
.husky/pre-commit
    ├── pnpm lint-staged     (Prettier + ESLint on staged .ts/.tsx/.js/.json/.md)
    ├── cargo fmt --check    (only if .rs files staged, runs from src-tauri/)
    └── pnpm turbo check     (type-check all packages, ~4s)
    │
    ▼
.husky/commit-msg
    └── scripts/verify-commit-msg.sh
    │
    ▼
Commit succeeds or fails with clear error
```

## Configuration

### package.json additions

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,json,md}": ["prettier --write"]
  }
}
```

### .husky/pre-commit

```bash
#!/bin/sh

# Run lint-staged for JS/TS formatting and linting
pnpm lint-staged

# Check if any Rust files are staged
if git diff --cached --name-only | grep -q '\.rs$'; then
  echo "Checking Rust formatting..."
  cd apps/desktop/src-tauri && cargo fmt --check
fi

# Type-check everything
pnpm turbo check
```

### .husky/commit-msg

```bash
#!/bin/sh
exec scripts/verify-commit-msg.sh "$1"
```

### scripts/verify-commit-msg.sh

```bash
#!/bin/bash
set -e

commit_msg_file="$1"
commit_msg=$(cat "$commit_msg_file")

# Pattern: type(NEBULA-xxx) or type(NEBULA-xxx, NEBULA-yyy, ...): message
pattern='^(feat|fix|chore|docs|refactor|test|ci|perf|build)\((NEBULA-[a-zA-Z0-9]+(,\s*NEBULA-[a-zA-Z0-9]+)*)\):\s+.+'

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "ERROR: Invalid commit message format."
  echo ""
  echo "Expected: type(NEBULA-xxx): description"
  echo "      or: type(NEBULA-xxx, NEBULA-yyy): description"
  echo ""
  echo "Valid types: feat, fix, chore, docs, refactor, test, ci, perf, build"
  echo ""
  echo "Examples:"
  echo "  feat(NEBULA-r4k): add pre-commit hooks"
  echo "  fix(NEBULA-123, NEBULA-456): resolve race condition"
  echo ""
  echo "Your message: $commit_msg"
  exit 1
fi
```

## Implementation Steps

1. Install dependencies: `pnpm add -D husky lint-staged`
2. Initialize husky: `pnpm exec husky init`
3. Create `.husky/pre-commit` hook
4. Create `.husky/commit-msg` hook
5. Create `scripts/verify-commit-msg.sh`
6. Add `lint-staged` config to `package.json`
7. Test with valid and invalid commits

## First-Time Setup

Automatic. Running `pnpm install` triggers husky via the `prepare` script, installing all git hooks.

## Notes

- Type-checking runs on every commit (~4s) since turbo caches results
- cargo fmt runs from `apps/desktop/src-tauri/` directory
- Ticket IDs use alphanumeric format (e.g., NEBULA-r4k, NEBULA-123)
