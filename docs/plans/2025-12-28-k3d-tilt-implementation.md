# k3d + Tilt Dev Environment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Docker Compose with k3d + Tilt for a single-command dev environment with proper health checks.

**Architecture:** k3d cluster with local registry, Tilt for orchestration, Starlark helper functions for easy service addition. Desktop app runs locally outside k8s.

**Tech Stack:** k3d, Tilt, ctlptl, Kubernetes manifests, Node.js health server

---

### Task 1: Add Worker Health Server

**Files:**
- Create: `apps/worker/src/health.ts`
- Modify: `apps/worker/src/index.ts`

**Step 1: Create the health server module**

Create `apps/worker/src/health.ts`:

```typescript
import { createServer } from 'node:http'

export function createHealthServer(port: number) {
  let isReady = false

  const server = createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      const code = isReady ? 200 : 503
      res.writeHead(code, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: isReady ? 'ok' : 'starting' }))
    } else {
      res.writeHead(404)
      res.end()
    }
  })

  server.listen(port, () => {
    console.log(`  Health endpoint: http://localhost:${port}/health`)
  })

  return {
    ready: () => { isReady = true },
    close: () => server.close(),
  }
}
```

**Step 2: Integrate health server into worker**

Modify `apps/worker/src/index.ts`:

```typescript
import { NativeConnection, Worker } from '@temporalio/worker'
import * as activities from './activities'
import { createHealthServer } from './health'

const config = {
  temporalAddress: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  taskQueue: process.env.TASK_QUEUE || 'default',
  namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  healthPort: parseInt(process.env.HEALTH_PORT || '8080'),
}

async function run() {
  console.log('Starting Temporal worker...')
  console.log(`  Temporal address: ${config.temporalAddress}`)
  console.log(`  Task queue: ${config.taskQueue}`)
  console.log(`  Namespace: ${config.namespace}`)

  const health = createHealthServer(config.healthPort)

  const connection = await NativeConnection.connect({
    address: config.temporalAddress,
  })

  const worker = await Worker.create({
    connection,
    namespace: config.namespace,
    workflowsPath: new URL('./workflows/index.ts', import.meta.url).pathname,
    activities,
    taskQueue: config.taskQueue,
  })

  health.ready()

  const shutdown = async () => {
    console.log('Shutting down worker...')
    health.close()
    await worker.shutdown()
    await connection.close()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  console.log('Worker connected and listening for tasks')
  await worker.run()
}

run().catch((err) => {
  console.error('Worker failed:', err)
  process.exit(1)
})
```

**Step 3: Type-check**

Run: `pnpm turbo check --filter=@nebula/worker`
Expected: PASS

**Step 4: Commit**

```bash
git add apps/worker/src/health.ts apps/worker/src/index.ts
git commit -m "feat(worker): add health endpoint"
```

---

### Task 2: Create Infrastructure Directory Structure

**Files:**
- Create: `infra/ctlptl.yaml`
- Create: `infra/lib/Tiltfile`
- Create: `infra/Tiltfile`

**Step 1: Create ctlptl cluster definition**

Create `infra/ctlptl.yaml`:

```yaml
apiVersion: ctlptl.dev/v1alpha1
kind: Registry
name: nebula-registry
port: 5000
---
apiVersion: ctlptl.dev/v1alpha1
kind: Cluster
product: k3d
name: k3d-nebula
registry: nebula-registry
```

**Step 2: Create helper functions library**

Create `infra/lib/Tiltfile`:

```python
def nebula_service(
    name,
    image=None,
    dockerfile=None,
    context=".",
    manifests=None,
    port_forwards=[],
    resource_deps=[],
    labels=[],
    live_update=[],
):
    """
    Standard Nebula service definition.
    Handles image building, k8s deployment, and Tilt resource config.
    """

    if dockerfile and image:
        docker_build(
            image,
            context,
            dockerfile=dockerfile,
            live_update=live_update,
        )

    if manifests:
        k8s_yaml(manifests)

    k8s_resource(
        name,
        port_forwards=port_forwards,
        resource_deps=resource_deps,
        labels=labels or ['app'],
    )

    return name


def infra_service(name, **kwargs):
    """Convenience wrapper for infrastructure services."""
    kwargs.setdefault('labels', ['infra'])
    return nebula_service(name, **kwargs)
```

**Step 3: Create main Tiltfile**

Create `infra/Tiltfile`:

```python
# Ensure cluster exists before doing anything
local('k3d cluster list | grep -q nebula || ctlptl apply -f ctlptl.yaml', dir=config.main_dir + '/infra')

allow_k8s_contexts('k3d-nebula')

# Load helpers
load('./lib/Tiltfile', 'nebula_service', 'infra_service')

# Infrastructure services
include('./services/postgres/Tiltfile')
include('./services/temporal/Tiltfile')
include('./services/convex/Tiltfile')

# Application services
include('./services/nebula-worker/Tiltfile')

# Desktop app (runs locally, not in k8s)
local_resource(
    'desktop',
    serve_cmd='pnpm tauri dev',
    serve_dir='../apps/desktop',
    deps=['../apps/desktop/src'],
    labels=['app'],
    resource_deps=['convex-backend'],
    auto_init=False,
)
```

**Step 4: Commit**

```bash
git add infra/
git commit -m "feat(infra): add Tilt base structure with helpers"
```

---

### Task 3: Create PostgreSQL Service

**Files:**
- Create: `infra/services/postgres/Tiltfile`
- Create: `infra/services/postgres/k8s.yaml`

**Step 1: Create PostgreSQL k8s manifest**

Create `infra/services/postgres/k8s.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_USER
              value: temporal
            - name: POSTGRES_PASSWORD
              value: temporal
            - name: POSTGRES_DB
              value: temporal
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
          readinessProbe:
            exec:
              command: ['pg_isready', '-U', 'temporal']
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            exec:
              command: ['pg_isready', '-U', 'temporal']
            initialDelaySeconds: 15
            periodSeconds: 10
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
```

**Step 2: Create PostgreSQL Tiltfile**

Create `infra/services/postgres/Tiltfile`:

```python
load('../../lib/Tiltfile', 'infra_service')

k8s_yaml('./k8s.yaml')

k8s_resource(
    'postgres',
    port_forwards=['5432:5432'],
    labels=['infra'],
)
```

**Step 3: Commit**

```bash
git add infra/services/postgres/
git commit -m "feat(infra): add PostgreSQL service"
```

---

### Task 4: Create Temporal Service

**Files:**
- Create: `infra/services/temporal/Tiltfile`
- Create: `infra/services/temporal/temporal.k8s.yaml`
- Create: `infra/services/temporal/temporal-ui.k8s.yaml`
- Create: `infra/services/temporal/config/dynamicconfig/development-sql.yaml`

**Step 1: Create Temporal dynamic config**

Create `infra/services/temporal/config/dynamicconfig/development-sql.yaml`:

```yaml
system.forceSearchAttributesCacheRefreshOnRead:
  - value: true
    constraints: {}
```

**Step 2: Create Temporal server manifest**

Create `infra/services/temporal/temporal.k8s.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: temporal-dynamicconfig
data:
  development-sql.yaml: |
    system.forceSearchAttributesCacheRefreshOnRead:
      - value: true
        constraints: {}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temporal
  labels:
    app: temporal
spec:
  replicas: 1
  selector:
    matchLabels:
      app: temporal
  template:
    metadata:
      labels:
        app: temporal
    spec:
      containers:
        - name: temporal
          image: temporalio/auto-setup:1.25
          ports:
            - containerPort: 7233
              name: grpc
            - containerPort: 7243
              name: http
          env:
            - name: DB
              value: postgres12
            - name: DB_PORT
              value: "5432"
            - name: POSTGRES_USER
              value: temporal
            - name: POSTGRES_PWD
              value: temporal
            - name: POSTGRES_SEEDS
              value: postgres
            - name: DYNAMIC_CONFIG_FILE_PATH
              value: /etc/temporal/config/dynamicconfig/development-sql.yaml
          volumeMounts:
            - name: dynamicconfig
              mountPath: /etc/temporal/config/dynamicconfig
          readinessProbe:
            exec:
              command: ['tctl', '--address', '127.0.0.1:7233', 'workflow', 'list']
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
          livenessProbe:
            exec:
              command: ['tctl', '--address', '127.0.0.1:7233', 'workflow', 'list']
            initialDelaySeconds: 60
            periodSeconds: 30
            timeoutSeconds: 5
      volumes:
        - name: dynamicconfig
          configMap:
            name: temporal-dynamicconfig
---
apiVersion: v1
kind: Service
metadata:
  name: temporal
spec:
  selector:
    app: temporal
  ports:
    - name: grpc
      port: 7233
      targetPort: 7233
    - name: http
      port: 7243
      targetPort: 7243
```

**Step 3: Create Temporal UI manifest**

Create `infra/services/temporal/temporal-ui.k8s.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: temporal-ui
  labels:
    app: temporal-ui
spec:
  replicas: 1
  selector:
    matchLabels:
      app: temporal-ui
  template:
    metadata:
      labels:
        app: temporal-ui
    spec:
      containers:
        - name: temporal-ui
          image: temporalio/ui:latest
          ports:
            - containerPort: 8080
          env:
            - name: TEMPORAL_ADDRESS
              value: temporal:7233
            - name: TEMPORAL_CORS_ORIGINS
              value: http://localhost:3000
          readinessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: temporal-ui
spec:
  selector:
    app: temporal-ui
  ports:
    - port: 8080
      targetPort: 8080
```

**Step 4: Create Temporal Tiltfile**

Create `infra/services/temporal/Tiltfile`:

```python
load('../../lib/Tiltfile', 'infra_service')

k8s_yaml('./temporal.k8s.yaml')
k8s_yaml('./temporal-ui.k8s.yaml')

k8s_resource(
    'temporal',
    port_forwards=['7233:7233', '7243:7243'],
    resource_deps=['postgres'],
    labels=['infra'],
)

k8s_resource(
    'temporal-ui',
    port_forwards=['8080:8080'],
    resource_deps=['temporal'],
    labels=['infra'],
)
```

**Step 5: Commit**

```bash
git add infra/services/temporal/
git commit -m "feat(infra): add Temporal server and UI services"
```

---

### Task 5: Create Convex Services

**Files:**
- Create: `infra/services/convex/Tiltfile`
- Create: `infra/services/convex/backend.k8s.yaml`
- Create: `infra/services/convex/dashboard.k8s.yaml`

**Step 1: Create Convex backend manifest**

Create `infra/services/convex/backend.k8s.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: convex-data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: convex-backend
  labels:
    app: convex-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: convex-backend
  template:
    metadata:
      labels:
        app: convex-backend
    spec:
      containers:
        - name: convex-backend
          image: ghcr.io/get-convex/convex-backend:latest
          ports:
            - containerPort: 3210
              name: backend
            - containerPort: 3211
              name: actions
          volumeMounts:
            - name: convex-data
              mountPath: /convex/data
          readinessProbe:
            httpGet:
              path: /version
              port: 3210
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /version
              port: 3210
            initialDelaySeconds: 15
            periodSeconds: 10
      volumes:
        - name: convex-data
          persistentVolumeClaim:
            claimName: convex-data-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: convex-backend
spec:
  selector:
    app: convex-backend
  ports:
    - name: backend
      port: 3210
      targetPort: 3210
    - name: actions
      port: 3211
      targetPort: 3211
```

**Step 2: Create Convex dashboard manifest**

Create `infra/services/convex/dashboard.k8s.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: convex-dashboard
  labels:
    app: convex-dashboard
spec:
  replicas: 1
  selector:
    matchLabels:
      app: convex-dashboard
  template:
    metadata:
      labels:
        app: convex-dashboard
    spec:
      containers:
        - name: convex-dashboard
          image: ghcr.io/get-convex/convex-dashboard:latest
          ports:
            - containerPort: 6791
          env:
            - name: NEXT_PUBLIC_DEPLOYMENT_URL
              value: http://convex-backend:3210
          readinessProbe:
            httpGet:
              path: /
              port: 6791
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 6791
            initialDelaySeconds: 15
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: convex-dashboard
spec:
  selector:
    app: convex-dashboard
  ports:
    - port: 6791
      targetPort: 6791
```

**Step 3: Create Convex Tiltfile**

Create `infra/services/convex/Tiltfile`:

```python
load('../../lib/Tiltfile', 'infra_service')

k8s_yaml('./backend.k8s.yaml')
k8s_yaml('./dashboard.k8s.yaml')

k8s_resource(
    'convex-backend',
    port_forwards=['3210:3210', '3211:3211'],
    labels=['infra'],
)

k8s_resource(
    'convex-dashboard',
    port_forwards=['6791:6791'],
    resource_deps=['convex-backend'],
    labels=['infra'],
)
```

**Step 4: Commit**

```bash
git add infra/services/convex/
git commit -m "feat(infra): add Convex backend and dashboard services"
```

---

### Task 6: Create Nebula Worker Service

**Files:**
- Create: `infra/services/nebula-worker/Tiltfile`
- Create: `infra/services/nebula-worker/k8s.yaml`

**Step 1: Create worker k8s manifest**

Create `infra/services/nebula-worker/k8s.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nebula-worker
  labels:
    app: nebula-worker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nebula-worker
  template:
    metadata:
      labels:
        app: nebula-worker
    spec:
      containers:
        - name: nebula-worker
          image: nebula-registry:5000/nebula-worker
          ports:
            - containerPort: 8080
              name: health
          env:
            - name: TEMPORAL_ADDRESS
              value: temporal:7233
            - name: TASK_QUEUE
              value: default
            - name: TEMPORAL_NAMESPACE
              value: default
            - name: HEALTH_PORT
              value: "8080"
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: nebula-worker
spec:
  selector:
    app: nebula-worker
  ports:
    - port: 8080
      targetPort: 8080
```

**Step 2: Create worker Tiltfile**

Create `infra/services/nebula-worker/Tiltfile`:

```python
load('../../lib/Tiltfile', 'nebula_service')

docker_build(
    'nebula-registry:5000/nebula-worker',
    '../..',
    dockerfile='../../apps/worker/Dockerfile',
    target='development',
    live_update=[
        sync('../../apps/worker/src', '/app/apps/worker/src'),
        sync('../../packages/shared/src', '/app/packages/shared/src'),
    ],
)

k8s_yaml('./k8s.yaml')

k8s_resource(
    'nebula-worker',
    port_forwards=['8081:8080'],
    resource_deps=['temporal'],
    labels=['app'],
)
```

**Step 3: Commit**

```bash
git add infra/services/nebula-worker/
git commit -m "feat(infra): add Nebula worker service with live reload"
```

---

### Task 7: Update justfile

**Files:**
- Modify: `justfile`

**Step 1: Update justfile with new commands**

Replace contents of `justfile`:

```just
# Nebula development commands

# Start everything (creates cluster if needed)
up:
    cd infra && tilt up

# Stop services (keeps cluster)
down:
    cd infra && tilt down

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
desktop-build:
    cd apps/desktop && pnpm tauri build
```

**Step 2: Commit**

```bash
git add justfile
git commit -m "feat: update justfile for k3d + Tilt workflow"
```

---

### Task 8: Update Worker Dockerfile for Health Port

**Files:**
- Modify: `apps/worker/Dockerfile`

**Step 1: Expose health port in Dockerfile**

Add `EXPOSE 8080` to the development stage in `apps/worker/Dockerfile`. After line 46 (`CMD ["pnpm", "dev"]`), the development stage should look like:

```dockerfile
# =============================================================================
# Development stage: hot reload with tsx watch
# =============================================================================
FROM deps AS development

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/worker ./apps/worker
COPY tsconfig.base.json ./

ENV NODE_ENV=development

WORKDIR /app/apps/worker

EXPOSE 8080

# Hot reload via tsx watch
CMD ["pnpm", "dev"]
```

Also add to production stage after line 77:

```dockerfile
EXPOSE 8080
```

**Step 2: Commit**

```bash
git add apps/worker/Dockerfile
git commit -m "feat(worker): expose health port in Dockerfile"
```

---

### Task 9: Clean Up Old Docker Compose

**Files:**
- Delete: `docker-compose.yml`

**Step 1: Remove old docker-compose.yml**

```bash
git rm docker-compose.yml
git commit -m "chore: remove docker-compose.yml (replaced by k3d + Tilt)"
```

---

### Task 10: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update commands section**

Update the Commands section in `CLAUDE.md`:

```markdown
## Commands

```bash
just up            # Start k3d cluster + all services via Tilt
just down          # Stop services (keeps cluster)
just reset         # Full reset (delete cluster + registry)

just check         # Type-check all packages
just lint          # Lint everything
just test          # Run tests
just build         # Production build
just desktop-build # Build desktop app for production
```

### Single-package commands

Use Turbo's filter to target specific packages:

```bash
pnpm turbo check --filter=@nebula/worker   # Type-check worker only
pnpm turbo test --filter=@nebula/shared    # Test shared only
pnpm turbo build --filter=@nebula/convex   # Build convex only
```

### Development UIs

After `just up`:
- **Tilt UI**: http://localhost:10350 (dev orchestration, logs)
- **Temporal UI**: http://localhost:8080 (workflow debugging)
- **Convex Dashboard**: http://localhost:6791 (data browser)
```

**Step 2: Update Architecture section**

Add k3d/Tilt info to Architecture section:

```markdown
## Architecture

```
infra/                 # k3d + Tilt configuration
  ctlptl.yaml          # Cluster + registry definition
  Tiltfile             # Main orchestration
  lib/Tiltfile         # Helper functions
  services/            # Per-service configs

apps/
  desktop/     # Tauri 2 + React + TailwindCSS (runs locally)
  worker/      # Temporal worker (runs in k3d)

packages/
  convex/      # Convex backend (schema, queries, mutations)
  shared/      # Shared TypeScript types + utilities
```
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for k3d + Tilt workflow"
```

---

### Task 11: Test the Setup

**Step 1: Install required tools (if not already installed)**

```bash
brew install k3d tilt tilt-dev/tap/ctlptl k9s
```

**Step 2: Start the environment**

```bash
just up
```

Expected: Tilt UI opens, all services start and turn green.

**Step 3: Verify services**

- Open http://localhost:10350 - Tilt UI should show all resources
- Open http://localhost:8080 - Temporal UI should load
- Open http://localhost:6791 - Convex Dashboard should load
- Run `curl http://localhost:8081/health` - Should return `{"status":"ok"}`

**Step 4: Test reset**

```bash
just reset
```

Expected: Cluster and registry deleted.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete k3d + Tilt dev environment setup"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add worker health server |
| 2 | Create infra directory structure |
| 3 | Create PostgreSQL service |
| 4 | Create Temporal services |
| 5 | Create Convex services |
| 6 | Create Nebula worker service |
| 7 | Update justfile |
| 8 | Update worker Dockerfile |
| 9 | Remove old docker-compose |
| 10 | Update CLAUDE.md |
| 11 | Test the setup |
