"use client";  // Ensure it's a client component

import { useState } from "react";

export default function DocxUploader() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type
    if (selectedFile && selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      alert("Only .docx files are allowed!");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a .docx file to upload");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/docx/upload", { // ✅ Corrected endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      const data = await response.json();
      setHtmlContent(data.text); // ✅ Use correct key (text instead of html)
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a .docx File</h1>
      <input type="file" accept=".docx" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Upload & Convert
      </button>
      {htmlContent && (
        <div className="mt-4 p-4 border rounded w-full max-w-2xl">
          <h2 className="text-xl font-semibold">Extracted Content</h2>
          <pre className="mt-2 border p-2 whitespace-pre-wrap">{htmlContent}</pre>
        </div>
      )}
    </div>
  );
}
