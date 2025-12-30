# Nebula development commands

# Show available commands (default)
help:
    @just --list

# Start everything (creates cluster if needed, kills any existing tilt)
up:
    @pkill -f "tilt up" 2>/dev/null || true
    cd infra && tilt up

# Stop services and tilt process (keeps cluster and volumes)
down:
    -cd infra && tilt down
    @pkill -f "tilt up" 2>/dev/null || true

# Full reset (delete cluster + registry)
reset:
    cd infra && tilt down || true
    ctlptl delete -f infra/ctlptl.yaml || true

# Type-check all packages
check:
    pnpm turbo check

# Lint all packages
lint:
    pnpm turbo lint

# Run all tests
test:
    pnpm turbo test

# Build all packages
build:
    pnpm turbo build

# Build desktop app for production
app-build:
    cd apps/desktop && pnpm tauri build

# Get Convex admin key (for dashboard login at localhost:6791)
convex-key:
    @kubectl exec deploy/convex-backend -- /convex/generate_admin_key.sh 2>/dev/null | head -1

# Synthesize infrastructure (K8s YAML + Tiltfile)
synth:
    cd infra && pnpm synth

# Release desktop app (creates tag, triggers CI)
release-desktop:
    ./scripts/release-desktop.sh

# Open bd issue tracker UI
bdui:
    bdui start --port 3123 --open
