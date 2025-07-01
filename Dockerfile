# Multi-stage build for minimal size
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Debug: Show what files we have
RUN echo "Files in /app:" && ls -la

# Install dependencies with better error handling and suppressed warnings
# For the deps stage, we install production dependencies only
RUN set -ex && \
  export NPM_CONFIG_LOGLEVEL=error && \
  if [ -f yarn.lock ]; then \
    echo "Using yarn with yarn.lock (production only)" && \
    yarn install --frozen-lockfile --production; \
  elif [ -f package-lock.json ]; then \
    echo "Using npm with package-lock.json (production only)" && \
    npm ci --omit=dev --silent; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Using pnpm with pnpm-lock.yaml (production only)" && \
    corepack enable pnpm && pnpm i --frozen-lockfile --prod; \
  else \
    echo "No lockfile found, running npm install (production only)" && \
    npm install --omit=dev --silent; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install ALL dependencies (including dev dependencies) for building
RUN set -ex && \
  export NPM_CONFIG_LOGLEVEL=error && \
  if [ -f yarn.lock ]; then \
    echo "Using yarn with yarn.lock (all dependencies)" && \
    yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    echo "Using npm with package-lock.json (all dependencies)" && \
    npm ci --silent; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Using pnpm with pnpm-lock.yaml (all dependencies)" && \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "No lockfile found, running npm install (all dependencies)" && \
    npm install --silent; \
  fi

# Copy source code
COPY . .

# Generate Convex types if needed
RUN npm run convex:codegen
RUN npm run postinstall

# Build the application
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
RUN npm run build

# Verify build output
RUN echo "Build output:" && ls -la .output/ && ls -la .output/server/

# Development stage - stops here for development containers
FROM builder AS development
WORKDIR /app

# Create a non-root user for development (same as production)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Ensure proper ownership of all directories including node_modules and cache
RUN chown -R nuxtjs:nodejs /app
RUN mkdir -p /app/node_modules/.cache && chown -R nuxtjs:nodejs /app/node_modules

# Set development environment
ENV NODE_ENV=development
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Switch to non-root user
USER nuxtjs

# Expose development port
EXPOSE 3000

# Default command for development (can be overridden)
CMD ["npm", "run", "dev"]

# Production image, copy all the files and run nuxt
FROM base AS runner
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 zentile

# Create necessary directories with correct permissions
RUN mkdir -p /app/.nuxt /app/.output && \
    chown -R zentile:nodejs /app

# Copy the built application with correct ownership
COPY --from=builder --chown=zentile:nodejs /app/.output ./
COPY --from=builder --chown=zentile:nodejs /app/package.json ./package.json

# Copy .nuxt directory for runtime operations (like nuxt.json writing)
COPY --from=builder --chown=zentile:nodejs /app/.nuxt ./.nuxt

# Verify files are copied correctly
RUN echo "Production files:" && ls -la && ls -la server/

USER zentile

EXPOSE 3000

# Start the server
CMD ["node", "server/index.mjs"]
