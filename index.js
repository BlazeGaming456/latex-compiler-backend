const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();

// ✅ Enable CORS for all origins (or configure as needed)
app.use(cors());
app.use(express.json());

// ✅ Handle preflight requests (especially needed for POSTs with JSON)
app.options("/compile", cors());

app.post("/compile", async (req, res) => {
  const { code } = req.body;

  const filename = `resume-${Date.now()}`;
  const texPath = `./${filename}.tex`;
  const pdfPath = `./${filename}.pdf`;

  try {
    fs.writeFileSync(texPath, code);

    exec(
      `pdflatex -interaction=nonstopmode -output-directory=. ${texPath}`,
      (error, stdout, stderr) => {
        ["aux", "log", "out"].forEach(ext => {
          try {
            fs.unlinkSync(`./${filename}.${ext}`);
          } catch (_) {}
        });

        if (error || !fs.existsSync(pdfPath)) {
          return res.status(500).json({
            error: "LaTeX compilation failed",
            details: stderr.toString(),
            logs: stdout.toString()
          });
        }

        const pdf = fs.readFileSync(pdfPath);
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);

        fs.unlinkSync(pdfPath);
        fs.unlinkSync(texPath);
      }
    );
  } catch (err) {
    res.status(500).json({
      error: "Server error during compilation",
      details: err.message
    });
  }
});

// ✅ Use a different port if Railway expects 8080
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));