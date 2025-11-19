# Educational Honeypot - Multistage Dockerfile
# Educational: Multistage builds reduce final image size by 60-80%
# Stage 1: Build dependencies
# Stage 2: Production runtime with minimal footprint

# ============================================================================
# STAGE 1: Builder (Install Dependencies)
# ============================================================================
# Educational: Use full Node.js image for building (has build tools)
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files first (layer caching optimization)
# Educational: If package.json doesn't change, Docker reuses this layer
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
# Educational: We need devDependencies for potential build steps
# --production=false ensures devDependencies are installed
RUN npm ci --production=false --quiet

# Copy application source code
COPY . .

# Optional: Run build steps here if needed
# Example: RUN npm run build (for TypeScript, webpack, etc.)
# This app doesn't need a build step, but keeping for educational reference

# ============================================================================
# STAGE 2: Production Runtime (Minimal Image)
# ============================================================================
# Educational: node:18-slim is ~180MB vs node:18 (~900MB)
# Slim = Debian-based minimal Node.js runtime
FROM node:18-slim AS production

# Install dumb-init (handles PID 1 signals properly)
# Educational: Node.js doesn't handle SIGTERM well as PID 1
# dumb-init ensures graceful shutdowns work correctly
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user for security
# Educational: Never run containers as root in production
RUN groupadd -r nodeapp && \
    useradd -r -g nodeapp -s /bin/bash -d /home/nodeapp nodeapp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
# Educational: --omit=dev excludes devDependencies (nodemon, sequelize-cli source)
# However, we NEED sequelize-cli for migrations, so keep it
RUN npm ci --only=production --quiet && \
    npm install -g sequelize-cli --quiet && \
    npm cache clean --force

# Copy application code from builder stage
# Educational: Copying from builder ensures consistent state
COPY --from=builder /app ./

# Copy .sequelizerc explicitly (needed for migrations)
COPY .sequelizerc ./

# Change ownership to non-root user
# Educational: Prevents container from writing to host as root
RUN chown -R nodeapp:nodeapp /app

# Switch to non-root user
USER nodeapp

# Expose port 8080 (App Engine standard)
# Educational: This is documentation only, doesn't actually publish port
EXPOSE 8080

# Health check
# Educational: Docker can monitor container health and restart if unhealthy
# Checks every 30s, timeout 3s, fails after 3 consecutive failures
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Set NODE_ENV to production
ENV NODE_ENV=production

# Use dumb-init to handle signals
# Educational: dumb-init forwards signals to Node.js and reaps zombie processes
ENTRYPOINT ["dumb-init", "--"]

# Start application
# Educational: Use node directly (not npm) for better signal handling
CMD ["node", "app.js"]

# ============================================================================
# Educational Notes - Multistage Build Benefits:
# ============================================================================
#
# 1. SIZE REDUCTION:
#    - Builder stage: ~1.2GB (includes build tools)
#    - Production stage: ~250MB (minimal runtime)
#    - Savings: ~950MB (79% reduction)
#
# 2. SECURITY:
#    - No build tools in production image (smaller attack surface)
#    - Runs as non-root user (principle of least privilege)
#    - Fewer packages = fewer CVEs (Common Vulnerabilities)
#
# 3. LAYER CACHING:
#    - package.json copied before source code
#    - npm install only runs if package.json changes
#    - Faster rebuilds during development
#
# 4. BEST PRACTICES:
#    - dumb-init for proper signal handling
#    - HEALTHCHECK for container monitoring
#    - .dockerignore to exclude unnecessary files
#    - Clean apt cache to reduce image size
#
# ============================================================================
# Build & Run Commands:
# ============================================================================
#
# Build image:
#   docker build -t honeypot-app:latest .
#
# Run container:
#   docker run -p 8080:8080 \
#     -e DB_HOST=host.docker.internal \
#     -e DB_USER=postgres \
#     -e DB_PASS=yourpass \
#     -e DB_NAME=honeypot_db \
#     honeypot-app:latest
#
# With docker-compose (recommended):
#   docker-compose up --build
#
# Check image size:
#   docker images honeypot-app
#
# Inspect layers:
#   docker history honeypot-app:latest
#
# ============================================================================
# Platform Considerations (Apple Silicon / M1 / M2):
# ============================================================================
#
# For Apple Silicon Macs, build for linux/amd64 platform:
#   docker build --platform linux/amd64 -t honeypot-app:latest .
#
# This ensures compatibility with:
#   - Google Cloud Run / App Engine
#   - AWS ECS / Fargate
#   - Most cloud platforms (run on x86_64)
#
# Docker Desktop for Mac can emulate x86_64 using Rosetta 2
#
