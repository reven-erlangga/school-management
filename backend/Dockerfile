# Stage 1: Builder
FROM node:20-alpine AS builder

# Install dependencies required for building (if any native modules or prisma engines)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/
# Force update provider to postgresql in case of file sync issues or old cache
# Use flexible regex to handle spacing variations
RUN sed -i 's/provider[[:space:]]*=[[:space:]]*"sqlite"/provider = "postgresql"/g' prisma/schema.prisma
# Fail build if postgresql is not set
RUN grep 'provider = "postgresql"' prisma/schema.prisma || (cat prisma/schema.prisma && exit 1)
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Generate Prisma Client (required for the build)
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install curl/wget for healthchecks if needed (optional, node:alpine has wget)
# RUN apk add --no-cache curl

# Create a non-root user and group
# node image comes with a 'node' user (uid 1000)
# We will use it later

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Install ffmpeg for video compression
RUN apk add --no-cache ffmpeg

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Copy prisma client and schema (schema is often needed for engine validation or migrations)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Use non-root user
USER node

# Create uploads directory and set permissions
USER root
RUN mkdir -p /app/uploads/settings && chown -R node:node /app/uploads
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main"]
