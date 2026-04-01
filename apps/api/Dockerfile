# Stage 1 — Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files first for caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies using whichever lock file exists
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source files
COPY . .

# If using TypeScript, build it
RUN if [ -f tsconfig.json ]; then npm run build; fi

# Stage 2 — Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Copy production dependencies only
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --only=production; \
    else npm install --only=production; fi

# Copy compiled build or source
COPY --from=builder /app/dist ./dist
# or if not using TypeScript:
# COPY --from=builder /app/src ./src

# Expose port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

# Default start command (adjust if different)
CMD ["node", "dist/index.js"]
