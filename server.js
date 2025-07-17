const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["https://easycv.vercel.app", "http://localhost:5000", "https://localhost:5000"];

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration for React frontend
app.use(cors({
  origin: function (origin, callback) {
			if (!origin) return callback(null, true);
		 	if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error("Not allowed by CORS"));
			}
		},
  credentials: true
}));

app.use((req, res, next) => {
	const apiKey = process.env.FLY_API_KEY;
	if (!apiKey) return next();
	if (req.headers["x-api-key"] === apiKey) {
		return next();
	}
	res.status(403).json({ error: "Forbidden" });
});


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/compile', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'tectonic-latex',
    timestamp: new Date().toISOString()
  });
});

// Main compilation endpoint
app.post('/compile', async (req, res) => {
  try {
    const { latex, filename = 'document' } = req.body;
    
    if (!latex) {
      return res.status(400).json({ 
        error: 'Missing required field: latex',
        message: 'Please provide a LaTeX string in the request body'
      });
    }

    // Validate LaTeX content
    if (typeof latex !== 'string' || latex.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid LaTeX content',
        message: 'LaTeX content must be a non-empty string'
      });
    }

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');
    const jobId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join('/tmp', `tectonic-${jobId}`);
    const texFile = path.join(tempDir, `${sanitizedFilename}.tex`);
    const outputDir = path.join(tempDir, 'output');

    // Create temporary directory
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    // Write LaTeX content to file
    await fs.writeFile(texFile, latex, 'utf8');

    // Compile with tectonic
    const tectonicCommand = `tectonic --outdir ${outputDir} ${texFile}`;
    
    exec(tectonicCommand, { timeout: 30000 }, async (error, stdout, stderr) => {
      try {
        if (error) {
          console.error('Tectonic compilation error:', error);
          console.error('stderr:', stderr);
          
          // Clean up temp files
          await cleanupTempFiles(tempDir);
          
          return res.status(500).json({
            error: 'LaTeX compilation failed',
            message: 'The provided LaTeX code could not be compiled',
            details: stderr || error.message
          });
        }

        // Find the generated PDF
        const pdfFiles = await findPdfFiles(outputDir);
        
        if (pdfFiles.length === 0) {
          await cleanupTempFiles(tempDir);
          return res.status(500).json({
            error: 'No PDF generated',
            message: 'Compilation succeeded but no PDF was produced'
          });
        }

        const pdfPath = pdfFiles[0];
        const pdfBuffer = await fs.readFile(pdfPath);
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        // Send PDF
        res.send(pdfBuffer);

        // Clean up temp files after sending response
        setTimeout(() => cleanupTempFiles(tempDir), 1000);

      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});

// Helper function to find PDF files
async function findPdfFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files
      .filter(file => file.endsWith('.pdf'))
      .map(file => path.join(directory, file));
  } catch (error) {
    console.error('Error finding PDF files:', error);
    return [];
  }
}

// Helper function to cleanup temporary files
async function cleanupTempFiles(tempDir) {
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tectonic LaTeX microservice running on port ${PORT}`);
  console.log(`📄 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Compile endpoint: POST http://localhost:${PORT}/compile`);
});

module.exports = app; 