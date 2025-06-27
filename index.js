// index.js
import express from "express";
import cors from "cors";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.post("/compile", async (req, res) => {
  const { code } = req.body;

  const filename = "resume";
  const texPath = `/tmp/${filename}.tex`;
  const pdfPath = `/tmp/${filename}.pdf`;

  //Writing the latex code to the file
  fs.writeFileSync(texPath, code);

  //Executing the pdflatex module.
  //Non-stop mode is to ignore latex error
  //We also specify the output directory
  exec(
    `pdflatex -interaction=nonstopmode -output-directory=/tmp ${texPath}`,
    (error, stdout, stderr) => {
      if (error || !fs.existsSync(pdfPath)) {
        console.error("Compilation error:", stderr);
        return res.status(500).send("LaTeX compilation failed.");
      }

      //Save the PDF and return it
      const pdf = fs.readFileSync(pdfPath);
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdf);
    }
  );
});

//Calling the port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 LaTeX compiler backend running on port ${PORT}`)
);
