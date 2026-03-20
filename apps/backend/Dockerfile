FROM node:20-alpine AS deps
RUN apk update && corepack enable
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/contracts/package.json ./packages/contracts/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/contracts/node_modules ./packages/contracts/node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/contracts ./packages/contracts
COPY apps/backend ./apps/backend
RUN pnpm --filter @thaieconomap/contracts build
RUN pnpm --filter thaieconomap-backend build

###################
# PRODUCTION
###################

FROM node:20-alpine AS production
RUN apk update && \
    apk add --no-cache postgresql-client bash openssl libgcc libstdc++ ncurses-libs tzdata
WORKDIR /app
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
