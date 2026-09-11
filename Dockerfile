# syntax=docker/dockerfile:1.7

# ─── Deps ────────────────────────────────────────────────────────────────
# Isolated stage so the deps layer caches on package-lock changes only.
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci


# ─── Builder ─────────────────────────────────────────────────────────────
# Next needs NEXT_PUBLIC_* vars at BUILD time to bake them into the client
# bundle. Railway sets these via the build environment; here we accept
# them as ARGs so the same Dockerfile works in local `docker build` too.
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat

# NEXT_PUBLIC_API_URL — the GraphQL endpoint the client bundle calls.
# Pass at build time: docker build --build-arg NEXT_PUBLIC_API_URL=... .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ─── Runner ──────────────────────────────────────────────────────────────
# Uses Next's standalone output — a self-contained server.js that ships
# with only the deps Next actually reached at build time. Way smaller
# than dragging the full node_modules along.
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# .next/standalone is Next's self-contained server bundle.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets aren't included in `standalone` — they live at
# .next/static and /public and must be copied in separately.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# The standalone build emits server.js at the project root.
CMD ["node", "server.js"]
