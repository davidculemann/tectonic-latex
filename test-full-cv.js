const fs = require("fs").promises;
const path = require("path");

// Full CV LaTeX document with anonymized data and comprehensive content
const fullCVLatex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=4.08003pt,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage{enumitem}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{textcomp}
\\usepackage{amsmath}
\\usepackage[dvipsnames]{xcolor}
\\usepackage{fontawesome}
\\definecolor{primaryColor}{RGB}{0, 79, 144}
\\pagecolor{white}
\\usepackage[
    pdftitle={John Smith CV},
    pdfauthor={John Smith},
    pdfcreator={EasyCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\renewcommand\\labelitemi{$\\circ$}

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
  \\textbf{\\Huge \\scshape John Smith} \\\\ \\vspace{1pt}
  \\small +1 (555) 123-4567
  \\hspace{2pt}
  \\href{mailto:john.smith@email.com}{john.smith@email.com}
  \\hspace{2pt}
  \\href{https://johnsmith.dev}{https://johnsmith.dev}
  \\hspace{2pt}
  \\mbox{\\href{https://www.linkedin.com/in/johnsmith/}{\\color{black}{\\footnotesize\\faLinkedin}\\hspace*{0.13cm}}}
  \\hspace{2pt}
  \\mbox{\\href{https://github.com/johnsmith}{\\color{black}{\\footnotesize\\faGithub}\\hspace*{0.13cm}}}
\\end{center}

%-----------PROFESSIONAL SUMMARY-----------
\\section{Professional Summary}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
    Experienced Software Engineer with 5+ years developing scalable web applications and AI-powered solutions. Proven track record in full-stack development, cloud architecture, and leading cross-functional teams.
  }}
\\end{itemize}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
  \\resumeSubheading
  {Stanford University}{Stanford, CA} 
  {Master of Science in Computer Science}{Sep 2018 -- Jun 2020}
  \\resumeItemListStart
    \\resumeItem{Specialization in Artificial Intelligence and Machine Learning}
    \\resumeItem{GPA: 3.8/4.0, Dean's List for Academic Excellence}
  \\resumeItemListEnd
  
  \\resumeSubheading
  {University of California, Berkeley}{Berkeley, CA}
  {Bachelor of Science in Computer Science}{Aug 2014 -- May 2018}
  \\resumeItemListStart
    \\resumeItem{Magna Cum Laude, Phi Beta Kappa Honor Society}
    \\resumeItem{GPA: 3.7/4.0, Regents and Chancellor Scholarship Recipient}
  \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
      \\textbf{Programming Languages:} JavaScript/TypeScript, Python, Java, Go, SQL \\\\
      \\textbf{Frontend:} React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS \\\\
      \\textbf{Backend:} Node.js, Express, FastAPI, Django, REST APIs \\\\
      \\textbf{Databases:} PostgreSQL, MongoDB, Redis, MySQL \\\\
      \\textbf{Cloud:} AWS, Google Cloud, Docker, Kubernetes \\\\
      \\textbf{AI/ML:} TensorFlow, PyTorch, OpenAI API, LangChain
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Professional Experience}
    \\resumeSubHeadingListStart
    
    \\resumeSubheading
    {TechCorp Inc.}{San Francisco, CA}
    {Senior Software Engineer}{Jan 2022 -- Present}
    \\resumeItemListStart
      \\resumeItem{Led development of AI-powered document generation platform serving 50,000+ users}
      \\resumeItem{Architected microservices infrastructure using Node.js, Docker, and Kubernetes}
      \\resumeItem{Implemented real-time collaboration features using WebSocket and Redis}
      \\resumeItem{Mentored 3 junior developers and established coding standards}
    \\resumeItemListEnd
    
    \\resumeSubheading
    {InnovateLabs}{Palo Alto, CA}
    {Software Engineer}{Jun 2020 -- Dec 2021}
    \\resumeItemListStart
      \\resumeItem{Developed React-based dashboard for ML model monitoring}
      \\resumeItem{Built scalable data pipeline processing 1M+ events daily}
      \\resumeItem{Optimized database queries improving API response time by 75 percent}
    \\resumeItemListEnd
    
    \\resumeSubHeadingListEnd

\\end{document}
`;

// Test function
async function testFullCV() {
  const API_URL = "http://localhost:5001";

  console.log("🧪 Testing Full CV Template with XeLaTeX (Fixed)...\n");

  try {
    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);

    // Test full CV compilation
    console.log("\n2. Testing Full CV LaTeX compilation...");
    const compileResponse = await fetch(`${API_URL}/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latex: fullCVLatex,
        filename: "full-cv-test-fixed",
      }),
    });

    if (compileResponse.ok) {
      const pdfBuffer = await compileResponse.arrayBuffer();
      const outputPath = path.join(__dirname, "full-cv-test-output.pdf");
      await fs.writeFile(outputPath, Buffer.from(pdfBuffer));
      console.log(`✅ PDF generated successfully! Saved to: ${outputPath}`);
      console.log(
        `📄 PDF size: ${(pdfBuffer.byteLength / 1024).toFixed(2)} KB`,
      );
    } else {
      const errorData = await compileResponse.json();
      console.error("❌ Compilation failed:", errorData);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run test
testFullCV();
