# Base image
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Copy prisma files first
COPY prisma ./prisma/
COPY package.json package-lock.json ./
RUN npm install

# Setup development environment
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma generates the client
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build the application for production
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start"] 