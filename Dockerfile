# Use Ubuntu as base image for tectonic installation
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PORT=5000

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Download and install pre-built tectonic binary (ARM64 version)
RUN curl -L https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-aarch64-unknown-linux-musl.tar.gz -o tectonic.tar.gz \
    && tar -xzf tectonic.tar.gz \
    && ls -lR \
    && find . -name tectonic -type f -exec mv {} /usr/local/bin/ \; \
    && chmod +x /usr/local/bin/tectonic \
    && rm -rf tectonic*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm ci --only=production

# Copy application code
COPY server.js ./

# Create non-root user for security
RUN useradd -r -s /bin/false tectonic \
    && chown -R tectonic:tectonic /app \
    && chmod 1777 /tmp

# Temporarily run as root for production use
# USER tectonic

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "server.js"] 