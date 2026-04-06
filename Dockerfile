# ─────────────────────────────────────────────
# Stage 1 — Install dependencies
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps

# Install libc compatibility for native binaries on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy lock files first to leverage Docker layer cache
COPY package.json package-lock.json* ./

# Install production + dev deps (needed for the build step)
RUN npm ci

# ─────────────────────────────────────────────
# Stage 2 — Build the application
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Bring in installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the full source tree
COPY . .

# Build environment variables baked into the bundle must be declared here.
# Runtime-only vars (e.g. secrets) should NOT be set here — inject them at
# container start via docker-compose or Kubernetes secrets instead.
# ARG NEXT_PUBLIC_API_BASE_URL
# ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3 — Production runner (minimal image)
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Copy only the standalone output and static assets produced by the build
COPY --from=builder /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by Next.js standalone output
CMD ["node", "server.js"]
