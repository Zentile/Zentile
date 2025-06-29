# Multi-stage build for minimal size
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Debug: Show what files we have
RUN echo "Files in /app:" && ls -la

# Install dependencies with better error handling
RUN set -ex && \
  if [ -f yarn.lock ]; then \
    echo "Using yarn with yarn.lock" && \
    yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    echo "Using npm with package-lock.json" && \
    npm ci --only=production; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Using pnpm with pnpm-lock.yaml" && \
    corepack enable pnpm && pnpm i --frozen-lockfile --prod; \
  else \
    echo "No lockfile found, running npm install --only=production" && \
    npm install --only=production; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy source code
COPY . .

# Install dev dependencies for build
RUN npm install

# Generate Convex types if needed
RUN npm run postinstall

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Verify build output
RUN echo "Build output:" && ls -la .output/ && ls -la .output/server/

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
RUN adduser --system --uid 1001 nuxtjs

# Copy the built application with correct ownership
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./

# Verify files are copied correctly
RUN echo "Production files:" && ls -la && ls -la server/

USER nuxtjs

EXPOSE 3000

# Start the server
CMD ["node", "server/index.mjs"]
