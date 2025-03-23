"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("File uploaded successfully!", result);
      } else {
        console.error("Upload failed:", result.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Upload Your DOCX File</h1>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
    </div>
  );
}
