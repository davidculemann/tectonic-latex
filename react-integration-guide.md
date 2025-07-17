# React Integration Guide for Tectonic LaTeX Microservice

This guide shows you how to integrate the tectonic LaTeX microservice with your react frontend.

## 1. React Component for LaTeX Compilation

Create this component in your React project:

```tsx
// components/LatexCompiler.tsx
import React, { useState } from 'react';

interface LatexCompilerProps {
  apiUrl?: string;
  onPdfGenerated?: (blob: Blob, filename: string) => void;
  onError?: (error: string) => void;
}

const LatexCompiler: React.FC<LatexCompilerProps> = ({
  apiUrl = 'http://localhost:5000',
  onPdfGenerated,
  onError
}) => {
  const [latex, setLatex] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('cv-document');

  const compileLatex = async () => {
    if (!latex.trim()) {
      const errorMsg = 'Please enter some LaTeX content';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latex: latex,
          filename: filename
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadFilename = `${filename}.pdf`;
        
        // Call the callback if provided
        onPdfGenerated?.(blob, downloadFilename);
        
        // Auto-download the PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Compilation failed';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = `Network error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="latex-compiler" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>LaTeX to PDF Compiler</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="filename" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Filename:
        </label>
        <input
          id="filename"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="cv-document"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="latex-input" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          LaTeX Code:
        </label>
        <textarea
          id="latex-input"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          placeholder="\\documentclass{article}&#10;\\begin{document}&#10;Hello World!&#10;\\end{document}"
          rows={15}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={compileLatex}
          disabled={loading || !latex.trim()}
          style={{
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Compiling...' : 'Generate PDF'}
        </button>
        
        <button
          onClick={() => setLatex('')}
          disabled={loading}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      {error && (
        <div style={{
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '15px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Example LaTeX for CV:</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{Your Name}
\\author{Software Engineer}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Experience}
\\textbf{Senior Developer} \\hfill 2020-Present \\\\
Company Name \\\\
- Led development of key features
- Mentored junior developers

\\section{Skills}
\\begin{itemize}
    \\item JavaScript/TypeScript
    \\item React, Node.js
    \\item LaTeX, Docker
\\end{itemize}

\\end{document}`}
        </pre>
      </div>
    </div>
  );
};

export default LatexCompiler;
```

## 2. React Router v7 Integration

Add this to your React Router v7 setup:

```tsx
// App.tsx or your main router file
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LatexCompiler from './components/LatexCompiler';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/latex-compiler',
        element: <LatexCompilerPage />
      },
      {
        path: '/cv-generator',
        element: <CVGeneratorPage />
      }
    ]
  }
]);

function Layout() {
  return (
    <div>
      <nav>
        <a href="/latex-compiler">LaTeX Compiler</a>
        <a href="/cv-generator">CV Generator</a>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function LatexCompilerPage() {
  const handlePdfGenerated = (blob: Blob, filename: string) => {
    console.log(`PDF generated: ${filename}`);
    // You can add additional logic here, like saving to Supabase
  };

  const handleError = (error: string) => {
    console.error('LaTeX compilation error:', error);
    // You can add error reporting logic here
  };

  return (
    <div>
      <h1>LaTeX to PDF Compiler</h1>
      <LatexCompiler
        apiUrl="http://localhost:5000" // Your tectonic microservice URL
        onPdfGenerated={handlePdfGenerated}
        onError={handleError}
      />
    </div>
  );
}

function CVGeneratorPage() {
  const [cvData, setCvData] = useState({
    name: '',
    title: '',
    experience: '',
    skills: ''
  });

  const generateLatex = () => {
    return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\geometry{margin=1in}

\\title{${cvData.name}}
\\author{${cvData.title}}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Experience}
${cvData.experience}

\\section{Skills}
\\begin{itemize}[leftmargin=*]
${cvData.skills.split(',').map(skill => `    \\item ${skill.trim()}`).join('\n')}
\\end{itemize}

\\end{document}`;
  };

  const handleGenerateCV = async () => {
    const latex = generateLatex();
    
    try {
      const response = await fetch('http://localhost:5000/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latex: latex,
          filename: `${cvData.name.toLowerCase().replace(/\s+/g, '-')}-cv`
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvData.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Network error: ${error}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>CV Generator</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Name:</label>
        <input
          type="text"
          value={cvData.name}
          onChange={(e) => setCvData({...cvData, name: e.target.value})}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Title:</label>
        <input
          type="text"
          value={cvData.title}
          onChange={(e) => setCvData({...cvData, title: e.target.value})}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Experience:</label>
        <textarea
          value={cvData.experience}
          onChange={(e) => setCvData({...cvData, experience: e.target.value})}
          rows={5}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="Enter your experience in LaTeX format..."
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Skills (comma-separated):</label>
        <input
          type="text"
          value={cvData.skills}
          onChange={(e) => setCvData({...cvData, skills: e.target.value})}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="JavaScript, React, Node.js, LaTeX"
        />
      </div>

      <button
        onClick={handleGenerateCV}
        disabled={!cvData.name || !cvData.title}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Generate CV PDF
      </button>
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

## 3. Environment Configuration

Create a `.env` file in your React project:

```env
# .env
REACT_APP_TECTONIC_API_URL=http://localhost:5000
```

Then update your components to use the environment variable:

```tsx
const apiUrl = process.env.REACT_APP_TECTONIC_API_URL || 'http://localhost:5000';
```

## 4. Supabase Integration (Optional)

If you want to save generated PDFs to Supabase:

```tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

const handlePdfGenerated = async (blob: Blob, filename: string) => {
  try {
    // Convert blob to base64
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('generated_pdfs')
      .insert({
        filename: filename,
        pdf_data: base64,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    console.log('PDF saved to Supabase:', data);
  } catch (error) {
    console.error('Error saving to Supabase:', error);
  }
};
```

## 5. Testing the Integration

1. **Start the tectonic microservice** (from this project directory):
   ```bash
   ./quick-start.sh
   ```

2. **Start your React app**:
   ```bash
   npm start
   ```

3. **Test the integration** by visiting your React app and using the LaTeX compiler

## 6. Production Deployment

For production, update the API URL to point to your deployed tectonic service:

```tsx
// In production, use your deployed tectonic service URL
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-tectonic-service.com' 
  : 'http://localhost:3000';
```

This integration provides a complete solution for your AI CV and cover letter generation application with full LaTeX support! 