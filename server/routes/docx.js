import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer with storage settings
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return cb(new Error("Only .docx files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Endpoint to handle .docx file upload and convert to text
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Convert .docx to plain text using Mammoth
    const result = await mammoth.extractRawText({ path: filePath }).catch((err) => {
      console.error("Mammoth error:", err);
      throw new Error("Failed to extract text from DOCX");
    });

    // Delete the uploaded file asynchronously
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.json({ text: result.value });
  } catch (error) {
    console.error("Error processing .docx file:", error.message);
    res.status(500).json({ error: error.message || "Failed to process file" });
  }
});

export default router;
