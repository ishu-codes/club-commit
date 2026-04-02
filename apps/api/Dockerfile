FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY apps/api/package.json apps/api/pnpm-lock.yaml apps/api/.npmrc ./
COPY apps/api/prisma ./prisma
RUN corepack enable && pnpm install --no-frozen-lockfile

FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/.npmrc ./.npmrc
COPY apps/api/package.json ./
COPY apps/api/src ./src
RUN corepack enable && pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN apk add --no-cache openssl && addgroup -S nodejs && adduser -S expressjs -G nodejs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

USER expressjs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "dist/index.js"]
