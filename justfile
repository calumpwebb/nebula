# Nebula development commands

# Start everything (Docker infra + app code)
up:
    docker compose up -d
    pnpm turbo dev

# Stop everything
down:
    docker compose down
    pkill -f "turbo dev" || true

# Stop and delete all Docker data
clean:
    docker compose down -v
    rm -rf node_modules/.cache/.turbo

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
