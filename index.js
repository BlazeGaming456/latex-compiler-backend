app.post("/compile", async (req, res) => {
  const { code } = req.body;

  // Create unique filename
  const filename = `resume-${Date.now()}`;
  const texPath = `./${filename}.tex`;
  const pdfPath = `./${filename}.pdf`;

  try {
    // Write LaTeX file
    fs.writeFileSync(texPath, code);

    // Execute pdflatex
    exec(
      `pdflatex -interaction=nonstopmode -output-directory=. ${texPath}`,
      (error, stdout, stderr) => {
        console.log('pdflatex stdout:', stdout);
        console.log('pdflatex stderr:', stderr);
        
        // Clean up auxiliary files
        ['aux', 'log', 'out'].forEach(ext => {
          try {
            fs.unlinkSync(`./${filename}.${ext}`);
          } catch (e) {}
        });

        if (error || !fs.existsSync(pdfPath)) {
          console.error('Compilation failed:', {error, stderr});
          return res.status(500).json({
            error: "LaTeX compilation failed",
            details: stderr.toString(),
            logs: stdout.toString()
          });
        }

        // Send PDF
        const pdf = fs.readFileSync(pdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdf);
        
        // Clean up PDF and tex file after sending
        fs.unlinkSync(pdfPath);
        fs.unlinkSync(texPath);
      }
    );
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      error: "Server error during compilation",
      details: err.message
    });
  }
});