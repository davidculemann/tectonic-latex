# XeLaTeX Microservice

A production-ready microservice for generating PDFs from LaTeX strings using the XeLaTeX engine. Perfect for AI CV and cover letter generation applications that require advanced font support, such as FontAwesome.

## 🚀 Features

-   **Full LaTeX Support**: Compiles complete LaTeX documents using the powerful XeLaTeX engine.
-   **Advanced Font Support**: Natively supports modern fonts and Unicode, including FontAwesome icons.
-   **Secure**: Runs in an isolated Docker container with proper security configurations.
-   **RESTful API**: Simple HTTP endpoints for easy integration with any frontend or backend.
-   **Docker Ready**: Fully containerized for consistent and reliable deployments.
-   **Production Ready**: Includes rate limiting, CORS, security headers, and robust error handling.

## 📋 Prerequisites

-   Docker and Docker Compose

## 🛠️ Installation & Setup

This service is designed to be run exclusively with Docker to ensure a consistent and reliable environment.

1.  **Clone the Repository**

    ```bash
    git clone <your-repo-url>
    cd tectonic-latex
    ```

2.  **Configure Environment Variables**

    Create a `.env` file in the root of the project and add the following variables:

    ```env
    PORT=5001
    FRONTEND_URL=http://localhost:5173
    ```

3.  **Build and Run with Docker Compose**

    ```bash
    docker-compose up --build
    ```

    The service will be available at `http://localhost:5001`.

## 📡 API Endpoints

### Health Check

-   **URL**: `/health`
-   **Method**: `GET`
-   **Description**: Checks the health of the service.
-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: `{"status":"healthy","service":"xelatex-latex","timestamp":"..."}`

### Compile LaTeX to PDF

-   **URL**: `/compile`
-   **Method**: `POST`
-   **Headers**: `Content-Type: application/json`
-   **Body**:

    ```json
    {
      "latex": "\\documentclass{article}\\usepackage{fontawesome}\\begin{document}Hello, \\faIcon{github}!\\end{document}",
      "filename": "my-document"
    }
    ```

-   **Success Response**:
    -   **Code**: `200 OK`
    -   **Content**: A PDF file stream.
    -   **Headers**:
        -   `Content-Type: application/pdf`
        -   `Content-Disposition: attachment; filename="my-document.pdf"`

## 🧪 Testing

The project includes several test scripts to verify the functionality of the service.

-   **`test-simple-xelatex.js`**: Compiles a simple "Hello World" document.
-   **`test-fontawesome-xelatex.js`**: Compiles a document with FontAwesome icons.
-   **`test-full-cv.js`**: Compiles a full CV template with complex formatting and icons.

To run a test, execute the corresponding script:

```bash
node test-full-cv.js
```

This will send a request to the running service and save the generated PDF in the root directory.

## 🔗 React Integration Example

Here's an example of how to call the service from a React component:

```javascript
import { useState } from 'react';

const PDFGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePDF = async (latexContent) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latex: latexContent,
          filename: 'generated-cv',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-cv.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate PDF.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => generatePDF(/* your LaTeX string */)} disabled={loading}>
        {loading ? 'Generating...' : 'Download PDF'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PDFGenerator;
```

## 🐛 Troubleshooting

-   **CORS Errors**: Ensure the `FRONTEND_URL` in your `.env` file matches the origin of your frontend application.
-   **Compilation Failures**: Check the Docker container logs for detailed error messages from XeLaTeX.

    ```bash
    docker-compose logs -f
    ```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
