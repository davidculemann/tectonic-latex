# Setup Instructions for Tectonic LaTeX Microservice

## Option 1: Local Development Setup

### Prerequisites
- Node.js 18+
- Rust and Cargo (for tectonic)

### Install Tectonic Locally

1. **Install Rust and Cargo** (if not already installed):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Install Tectonic**:
   ```bash
   cargo install tectonic
   ```

3. **Verify Installation**:
   ```bash
   tectonic --version
   ```

### Run the Service Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Test the Service**:
   ```bash
   node test-example.js
   ```

## Option 2: Docker Setup

### Prerequisites
- Docker Desktop installed and running

### Run with Docker

1. **Start Docker Desktop** (if not already running)

2. **Build and Run**:
   ```bash
   docker-compose up --build
   ```

3. **Or build manually**:
   ```bash
   docker build -t tectonic-latex .
   docker run -p 3000:3000 tectonic-latex
   ```

## Testing the Service

Once the service is running (either locally or in Docker), test it:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test compilation
curl -X POST http://localhost:3000/compile \
  -H "Content-Type: application/json" \
  -d '{"latex": "\\documentclass{article}\\begin{document}Hello World\\end{document}"}' \
  --output test.pdf
```

## Integration with React Frontend

1. **Copy the React components** from `react-integration-example.tsx` to your React project

2. **Update the API URL** in your React components to point to your tectonic service

3. **Test the integration** by visiting your React app and using the LaTeX compiler

## Environment Variables

You can customize the service behavior with these environment variables:

- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: CORS origin for your React frontend (default: http://localhost:5173)
- `NODE_ENV`: Node environment (default: production)

## Troubleshooting

### Common Issues

1. **"tectonic command not found"**
   - Make sure tectonic is installed: `cargo install tectonic`
   - Or use Docker which includes tectonic

2. **Docker daemon not running**
   - Start Docker Desktop
   - On macOS: Open Docker Desktop app

3. **CORS errors from frontend**
   - Set `FRONTEND_URL` environment variable
   - Or update CORS configuration in `server.js`

4. **Compilation timeouts**
   - Increase timeout in `server.js` (currently 30s)
   - Check LaTeX syntax for errors

### Logs

```bash
# Local logs
npm start

# Docker logs
docker logs tectonic-latex

# Follow logs in real-time
docker logs -f tectonic-latex
```

## Production Deployment

For production deployment:

1. **Use Docker** (recommended):
   ```bash
   docker build -t tectonic-latex .
   docker run -d -p 3000:3000 tectonic-latex
   ```

2. **Set environment variables**:
   ```bash
   docker run -d -p 3000:3000 \
     -e FRONTEND_URL=https://yourdomain.com \
     -e NODE_ENV=production \
     tectonic-latex
   ```

3. **Use a reverse proxy** (nginx, etc.) for SSL termination

4. **Monitor the service** with health checks at `/health` 