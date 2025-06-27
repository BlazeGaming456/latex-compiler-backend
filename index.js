const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
        // Clean up
        ["aux", "log", "out"].forEach(ext => {
          try {
            fs.unlinkSync(`./${filename}.${ext}`);
          } catch (e) {}
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

app.listen(3000, () => console.log("Server running on port 3000"));