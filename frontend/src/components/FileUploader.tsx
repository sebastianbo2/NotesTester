import { useState, type ChangeEvent } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    
    const formData = new FormData();
    formData.append("file", file);
    
    await fetch(`${import.meta.env.VITE_SERVER_URL}/api/upload`, {
      method: "POST",
      body: formData,
    })

    setStatus("success")
  }

  async function handleSummarize() {
    if (!file || status !== "success") {
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/summarize`, {
      method: "POST",
    })

    const data = await res.json();
    console.log(data.summary)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && status !== "uploading" && (
        <button onClick={handleFileUpload}>Upload</button>
      )}
      {<button onClick={handleSummarize}>Summarize</button>}
    </div>
  );
}
