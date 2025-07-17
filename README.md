# Tectonic LaTeX Microservice

A production-ready microservice for generating PDFs from LaTeX strings using the Tectonic engine. Perfect for AI CV and cover letter generation applications.

## 🚀 Features

- **Full LaTeX Support**: Complete LaTeX documents with `\documentclass`, `\begin{document}`, etc.
- **Automatic Package Management**: Tectonic automatically downloads missing packages
- **Secure**: Runs in isolated environment with proper cleanup
- **RESTful API**: Simple HTTP endpoints for easy integration
- **Docker Ready**: Containerized for easy deployment
- **Production Ready**: Rate limiting, CORS, security headers, error handling

## 📋 Prerequisites

- Node.js 18+ (for local development)
- Docker (for containerized deployment)
- Tectonic engine (automatically installed in Docker)

## 🛠️ Installation & Setup

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd tectonic-latex

# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t tectonic-latex .
docker run -p 3000:3000 tectonic-latex
```

### Option 2: Local Development

```bash
# Install tectonic globally
cargo install tectonic

# Install Node.js dependencies
npm install

# Start the server
npm start

# For development with auto-restart
npm run dev
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "tectonic-latex",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Compile LaTeX to PDF
```bash
POST /compile
Content-Type: application/json

{
  "latex": "\\documentclass{article}\\begin{document}Hello World\\end{document}",
  "filename": "my-document"
}
```

**Response:** PDF file with headers:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="my-document.pdf"`

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `FRONTEND_URL` | `http://localhost:5173` | CORS origin for React frontend |
| `NODE_ENV` | `production` | Node environment |

### Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable in `server.js`

## 🧪 Testing

Run the test script to verify the service:

```bash
node test-example.js
```

This will:
1. Test the health endpoint
2. Compile a sample LaTeX document
3. Save the generated PDF as `test-output.pdf`

## 🔗 Integration with React Router v7

Here's how to integrate with your React frontend:

```typescript
// React component example
import { useState } from 'react';

const LatexCompiler = () => {
  const [latex, setLatex] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const compileLatex = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latex: latex,
          filename: 'cv-document'
        })
      });

      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cv-document.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Compilation failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="Enter your LaTeX code here..."
        rows={10}
        cols={80}
      />
      <button onClick={compileLatex} disabled={loading}>
        {loading ? 'Compiling...' : 'Generate PDF'}
      </button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
};
```

## 📦 Docker Commands

```bash
# Build image
docker build -t tectonic-latex .

# Run container
docker run -p 5000:5000 tectonic-latex

# Run with custom environment
docker run -p 5000:5000 \
  -e FRONTEND_URL=http://localhost:5173 \
  -e NODE_ENV=production \
  tectonic-latex

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: Prevents abuse
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Sanitizes LaTeX input
- **Non-root User**: Runs as `tectonic` user in Docker
- **Temporary Files**: Automatic cleanup after compilation

## 🐛 Troubleshooting

### Common Issues

1. **"tectonic command not found"**
   - Install tectonic: `cargo install tectonic`
   - Or use Docker which includes tectonic

2. **CORS errors from frontend**
   - Set `FRONTEND_URL` environment variable
   - Or update CORS configuration in `server.js`

3. **Compilation timeouts**
   - Increase timeout in `server.js` (currently 30s)
   - Check LaTeX syntax for errors

4. **Memory issues**
   - Large LaTeX documents may need more memory
   - Consider increasing Docker memory limits

### Logs

```bash
# View application logs
docker logs tectonic-latex

# Follow logs in real-time
docker logs -f tectonic-latex
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the test examples in `test-example.js`
