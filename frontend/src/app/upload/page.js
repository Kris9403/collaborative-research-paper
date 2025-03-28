"use client";  // <-- Add this line

import { useState } from "react";

export default function DocxUploader() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a .docx file to upload");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      const data = await response.json();
      setHtmlContent(data.html);
    } catch (error) {
      console.error("Error uploading file:", error);
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
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="mt-2 border p-2" />
        </div>
      )}
    </div>
  );
}
