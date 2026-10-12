# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY backend/package.json backend/package-lock.json* ./backend/

# Install build dependencies
RUN npm install
RUN npm --prefix backend install

# Copy application source code
COPY . .

# Build Vite SPA client and TypeScript backend server
RUN npm run build

# Stage 2: Production Container Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy backend dependencies
COPY backend/package.json backend/package-lock.json* ./backend/
RUN npm --prefix backend install --only=production

# Copy compiled bundles
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3001

CMD ["node", "backend/dist/server.js"]
