# =========================
# Stage 1: Build
# =========================
FROM node:22-alpine AS builder

LABEL maintainer="Tho Nguyen <tho.nv@svtech.com.vn>"
LABEL org.opencontainers.image.title="S-Core Kafka Service"
LABEL org.opencontainers.image.description="Kafka Service for SCORE"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="SVTECH"
# LABEL org.opencontainers.image.source="https://gitlab.xxx.vn/project/s-core-kafka"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# =========================
# Stage 2: Runtime
# =========================
FROM node:22-alpine

LABEL maintainer="Tho Nguyen <tho.nv@svtech.com.vn>"
LABEL org.opencontainers.image.title="S-Core Kafka Service"
LABEL org.opencontainers.image.description="Kafka Service Runtime"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="SVTECH"

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]