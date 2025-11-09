import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3001;

// static build (when you later run `npm run build` in web)
app.use(express.static(path.resolve("../web/dist")));

// uploads to tmp dir
const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });

// POST /api/inspect: upload a file and run exe_inspector
app.post("/api/inspect", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no file uploaded" });

  const exePath = path.resolve("../tools/exe_inspector");
  if (!fs.existsSync(exePath)) {
    fs.rmSync(req.file.path, { force: true });
    return res.status(500).json({ error: "exe_inspector not found in tools/" });
  }

  const args = [req.file.path, "--verbose"];
  const child = spawn(exePath, args);

  let out = "";
  let err = "";
  child.stdout.on("data", (d) => (out += d.toString()));
  child.stderr.on("data", (d) => (err += d.toString()));

  child.on("close", (code) => {
    // cleanup uploaded file
    fs.rmSync(req.file.path, { force: true });

    if (code !== 0) {
      return res.status(500).json({ error: "inspector failed", code, stderr: err.trim() });
    }
    // send back raw text; front-end will just show it
    res.json({ output: out.trim() });
  });
});

// fallback to frontend (only after build)
app.get("*", (req, res) => {
  const indexPath = path.resolve("../web/dist/index.html");
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(200).send("Server running. Build the web app to serve UI.");
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
