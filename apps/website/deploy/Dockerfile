# syntax=docker/dockerfile:1

# Nebula website Dockerfile
# Multi-stage build for development and production

ARG NODE_VERSION=22

# =============================================================================
# Base stage: shared dependencies
# =============================================================================
FROM node:${NODE_VERSION}-slim AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# =============================================================================
# Dependencies stage: install all dependencies
# =============================================================================
FROM base AS deps

# Copy workspace config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/website/package.json ./apps/website/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# =============================================================================
# Development stage: hot reload with astro dev
# =============================================================================
FROM deps AS development

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/website ./apps/website
COPY tsconfig.base.json ./

ENV NODE_ENV=development

WORKDIR /app/apps/website

EXPOSE 4321

# Hot reload via astro dev
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# =============================================================================
# Builder stage: build static site
# =============================================================================
FROM deps AS builder

COPY packages/shared ./packages/shared
COPY apps/website ./apps/website
COPY tsconfig.base.json ./

WORKDIR /app/apps/website
RUN pnpm build

# =============================================================================
# Production stage: serve with nginx
# =============================================================================
FROM nginx:alpine AS production

# Copy built static files
COPY --from=builder /app/apps/website/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
