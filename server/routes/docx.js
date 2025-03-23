import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to handle .docx file upload and convert to text
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Convert .docx to plain text using Mammoth
    const result = await mammoth.extractRawText({ path: filePath });

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ text: result.value });
  } catch (error) {
    console.error("Error processing .docx file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

export default router;
