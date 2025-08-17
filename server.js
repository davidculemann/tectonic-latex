const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy (required for Fly.io)
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const allowedOrigins = [
  "https://easycv.vercel.app",
  "https://jobsprout.ai",
  "http://localhost:3000",
  "https://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "xelatex-pdf-service",
    timestamp: new Date().toISOString(),
    engine: "XeLaTeX",
  });
});

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
  message: {
    error: "Too many requests",
    message: "Rate limit exceeded. Please try again later.",
  },
});
app.use(limiter);

// Cleanup function for temporary files
async function cleanupTempFiles(tempDir) {
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Error cleaning up temp files:", error);
  }
}

// Find PDF files in directory
async function findPdfFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => path.join(dir, file));
  } catch (error) {
    console.error("Error finding PDF files:", error);
    return [];
  }
}

// XeLaTeX compilation function
async function compileWithXeLaTeX(texFile, outputDir) {
  return new Promise((resolve, reject) => {
    const command = `xelatex -interaction=nonstopmode -output-directory=${outputDir} ${texFile}`;

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("XeLaTeX compilation error:", error);
        console.error("stderr:", stderr);
        reject(new Error(`XeLaTeX compilation failed: ${stderr}`));
      } else {
        console.log("XeLaTeX compilation successful");
        resolve();
      }
    });
  });
}

// Main compilation endpoint
app.post("/compile", async (req, res) => {
  try {
    const { latex, filename = "document" } = req.body;

    if (!latex) {
      return res.status(400).json({
        error: "Missing required field: latex",
        message: "Please provide a LaTeX string in the request body",
      });
    }

    // Validate LaTeX content
    if (typeof latex !== "string" || latex.length === 0) {
      return res.status(400).json({
        error: "Invalid LaTeX content",
        message: "LaTeX content must be a non-empty string",
      });
    }

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9-_]/g, "_");
    const jobId = crypto.randomBytes(8).toString("hex");
    const tempDir = path.join("/tmp", `xelatex-${jobId}`);
    const texFile = path.join(tempDir, `${sanitizedFilename}.tex`);
    const outputDir = path.join(tempDir, "output");

    // Create temporary directory
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    // Write LaTeX content to file
    await fs.writeFile(texFile, latex, "utf8");

    // Copy fontawesome.sty to temp directory
    const fontawesomeSty = path.join(__dirname, "fontawesome.sty");
    try {
      await fs.copyFile(fontawesomeSty, path.join(tempDir, "fontawesome.sty"));
    } catch (error) {
      console.error("Error copying fontawesome.sty:", error);
      // Continue without FontAwesome if there's an error
    }

    // Compile with XeLaTeX
    try {
      await compileWithXeLaTeX(texFile, outputDir);

      // Find the generated PDF
      const pdfFiles = await findPdfFiles(outputDir);

      if (pdfFiles.length === 0) {
        await cleanupTempFiles(tempDir);
        return res.status(500).json({
          error: "No PDF generated",
          message: "Compilation succeeded but no PDF was produced",
        });
      }

      const pdfPath = pdfFiles[0];
      const pdfBuffer = await fs.readFile(pdfPath);

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${sanitizedFilename}.pdf"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Send PDF
      res.send(pdfBuffer);

      // Clean up temp files after sending response
      setTimeout(() => cleanupTempFiles(tempDir), 1000);
    } catch (compilationError) {
      await cleanupTempFiles(tempDir);
      return res.status(500).json({
        error: "LaTeX compilation failed",
        message: "The provided LaTeX code could not be compiled",
        details: compilationError.message,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 XeLaTeX LaTeX microservice running on port ${PORT}`);
  console.log(`📄 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Compile endpoint: POST http://localhost:${PORT}/compile`);
});
