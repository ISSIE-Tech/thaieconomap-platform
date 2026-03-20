FROM node:20-alpine AS deps
RUN apk update && corepack enable
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/contracts/package.json ./packages/contracts/
COPY apps/gateway/package.json ./apps/gateway/
RUN pnpm install --frozen-lockfile

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=deps /app/apps/gateway/node_modules ./apps/gateway/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/contracts ./packages/contracts
COPY apps/gateway ./apps/gateway
RUN pnpm --filter @thaieconomap/contracts build
RUN pnpm --filter thaieconomap-gateway build

###################
# PRODUCTION
###################

FROM node:20-alpine AS production
RUN apk update && \
    apk add --no-cache postgresql-client bash openssl libgcc libstdc++ ncurses-libs tzdata
WORKDIR /app
COPY --from=build /app/apps/gateway/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
