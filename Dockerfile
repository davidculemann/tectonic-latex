# XeLaTeX Microservice Dockerfile
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PORT=5001

# Install system dependencies and TeX Live
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    libssl-dev \
    texlive-full \
    texlive-fonts-extra \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-latex-recommended \
    texlive-science \
    texlive-publishers \
    texlive-lang-english \
    fontconfig \
    fonts-font-awesome \
    fonts-dejavu \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install --only=production

# Copy application code
COPY server.js ./
COPY fontawesome.sty ./

# Create non-root user for security
RUN useradd -r -s /bin/false xelatex \
    && chown -R xelatex:xelatex /app \
    && chmod 1777 /tmp

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Start the application
CMD ["node", "server.js"] 