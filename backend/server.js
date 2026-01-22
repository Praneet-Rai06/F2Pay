const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Root route (for browser / Render sanity)
app.get("/", (req, res) => {
  res.send("🚀 F2Pay Backend is running successfully!");
});

// ✅ Health check (Render friendly)
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// Upload image
app.post("/upload", (req, res) => {
  const { image, username } = req.body;
  if (!image || !username) {
    return res.status(400).send("Missing data");
  }

  const userFolder = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "labels",
    username
  );

  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  const files = fs.readdirSync(userFolder).filter(f => f.endsWith(".png"));
  const nextFileNumber = files.length + 1;
  const filePath = path.join(userFolder, `${nextFileNumber}.png`);

  const imageData = image.replace(/^data:image\/png;base64,/, "");

  fs.writeFile(filePath, imageData, "base64", err => {
    if (err) {
      return res.status(500).send("Error saving image");
    }
    res.json({ message: "Image saved", path: filePath });
  });
});

// Get folders
app.get("/folders", (req, res) => {
  const directoryPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "labels"
  );

  fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const folderNames = files
      .filter(file => file.isDirectory())
      .map(dir => dir.name);

    res.json(folderNames);
  });
});

// ✅ Correct Render port handling
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
