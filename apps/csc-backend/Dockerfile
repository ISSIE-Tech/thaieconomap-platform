FROM node:24-alpine AS deps
RUN apk update && corepack enable
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/csc-backend/package.json ./apps/csc-backend/
RUN pnpm install --frozen-lockfile

###################
# BUILD FOR PRODUCTION
###################

FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/csc-backend/node_modules ./apps/csc-backend/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/csc-backend ./apps/csc-backend
RUN pnpm --filter csc-backend build
RUN pnpm --filter csc-backend deploy --legacy /app/deploy-output

###################
# PRODUCTION
###################

FROM node:24-alpine AS production
RUN apk update && apk add --no-cache tzdata
WORKDIR /app
COPY --from=build /app/deploy-output/node_modules ./node_modules
COPY --from=build /app/apps/csc-backend/dist ./dist

CMD ["node", "dist/main.js"]
