FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable
WORKDIR /app

FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/csc-liff/package.json ./apps/csc-liff/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/csc-liff/node_modules ./apps/csc-liff/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/csc-liff ./apps/csc-liff
RUN pnpm --filter csc-liff build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/csc-liff/public ./apps/csc-liff/public
RUN mkdir -p apps/csc-liff/.next
RUN chown nextjs:nodejs apps/csc-liff/.next

COPY --from=builder --chown=nextjs:nodejs /app/apps/csc-liff/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/csc-liff/.next/static ./apps/csc-liff/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/csc-liff/server.js"]
