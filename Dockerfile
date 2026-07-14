# Stage 1: Build the application
FROM node:21.5-alpine3.18 AS builder

# Set the working directory for the build stage
WORKDIR /app

# git isn't installed in the base alpine image by default. The docs plugin's
# "last updated by/at" feature shells out to the git CLI at build time and hard-fails
# the whole build if it can't find one — not just for the specific file it's checking.
RUN apk add --no-cache git

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code into the container
# Note: this must include .git — the docs plugin's "last updated by/at" feature reads
# git history at build time, and errors out entirely if .git isn't present at all.
COPY . .

# TEMPORARY DIAGNOSTIC — remove once the .git-in-build-context issue is confirmed/fixed.
RUN echo "--- .git diagnostic ---" && \
    ls -la /app | head -20 && \
    echo "--- /app/.git contents (if any) ---" && \
    (ls -la /app/.git 2>&1 || echo "NO /app/.git DIRECTORY") && \
    echo "--- git rev-parse check ---" && \
    (git -C /app rev-parse --is-inside-work-tree 2>&1 || echo "git rev-parse FAILED") && \
    (which git || echo "no git binary in image")

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
