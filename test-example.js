const fs = require('fs');
const path = require('path');

// Example LaTeX document
const exampleLatex = `\\documentclass[letterpaper,11pt]{article}

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
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{textcomp}
\\usepackage{amsmath}
\\usepackage[dvipsnames]{xcolor}
\\usepackage{fontawesome}
\\definecolor{primaryColor}{RGB}{0, 79, 144}
\\input{glyphtounicode}
\\pagecolor{white}
\\usepackage[
    pdftitle={Davideeee Culemann CV},
    pdfauthor={Davideeee Culemann},
    pdfcreator={EasyCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}

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

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

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

\\newcommand{\\resumeSubheadingFormatted}[2]{
  \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
    \\end{tabular*}\\vspace{-9pt}
}

\\newcommand{\\resumeSubSubheadingFormatted}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small#2} \\\\
    \\end{tabular*}\\vspace{-9pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
  \\textbf{\\Huge \\scshape Davideeee Culemann} \\\\ \\vspace{1pt}
  \\small 07402099676
  \\hspace{2pt}
  \\href{mailto:davidculemann@gmail.com}{davidculemann@gmail.com}
  \\hspace{2pt}
  \\href{https://davidculemann.com}{https://davidculemann.com}
  \\hspace{2pt}
  \\mbox{\\href{https://www.linkedin.com/in/david-culemann/}{\\color{black}{\\footnotesize\\faLinkedin}\\hspace*{0.13cm}}}
  \\hspace{2pt}
  \\mbox{\\href{https://github.com/davidculemann}{\\color{black}{\\footnotesize\\faGithub}\\hspace*{0.13cm}}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
  \\resumeSubheading
  {Cambridge}{} 
  {Masters of Engineering}{Present -- Present}
  \\resumeSubHeadingListEnd

%-----------SKILLS-----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
      No skills listed
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
    \\resumeSubHeadingListStart
    \\resumeSubheadingFormatted{}{}
    \\resumeSubSubheadingFormatted{}{Present -- Present}
    \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
    \\resumeProjectHeading{No projects listed}{}
    \\resumeSubHeadingListEnd

\\end{document}`;

// Test function
async function testTectonicAPI() {
  const API_URL = 'http://localhost:5001';
  
  console.log('🧪 Testing Tectonic LaTeX API...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test compilation
    console.log('\n2. Testing LaTeX compilation...');
    const compileResponse = await fetch(`${API_URL}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latex: exampleLatex,
        filename: 'test-document'
      })
    });
    
    if (compileResponse.ok) {
      const pdfBuffer = await compileResponse.arrayBuffer();
      const outputPath = path.join(__dirname, 'test-output.pdf');
      fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
      console.log(`✅ PDF generated successfully! Saved to: ${outputPath}`);
      console.log(`📄 PDF size: ${(pdfBuffer.byteLength / 1024).toFixed(2)} KB`);
    } else {
      const errorData = await compileResponse.json();
      console.error('❌ Compilation failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the tectonic service is running:');
    console.log('   npm start');
    console.log('   or');
    console.log('   docker-compose up');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testTectonicAPI();
}

module.exports = { testTectonicAPI, exampleLatex }; 