# Stage 1: Build the application
FROM node:21.5-alpine3.18 AS builder

# Set the working directory for the build stage
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code into the container
# Note: this must include .git — the docs plugin's "last updated by/at" feature reads
# git history at build time, and errors out entirely if .git isn't present at all.
# When building via `docker/build-push-action`/buildx, that requires passing
# --build-arg BUILDKIT_CONTEXT_KEEP_GIT_DIR=1 (see the GitHub Actions workflow),
# otherwise BuildKit strips .git from the context even without a .dockerignore rule.
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the final image
FROM node:21.5-alpine3.18

# Set the working directory within the container
WORKDIR /app


# Install 'serve' to serve the built application
RUN npm install -g serve

# Install wget (needed for health check)
RUN apk add --no-cache wget

# Copy the built application files from the builder stage
COPY --from=builder /app/build /app/build

# Expose port 3000 for the web server
EXPOSE 3000

# Health check command (optional)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start the application using 'serve'
CMD ["serve", "-s", "build", "-l", "3000"]
