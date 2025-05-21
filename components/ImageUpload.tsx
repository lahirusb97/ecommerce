import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const file = fileInputRef.current?.files?.[0];
    if (!file) return setError("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (res.ok) setImgUrl(data.url);
    else setError(data.error || "Upload failed");
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input ref={fileInputRef} type="file" accept="image/*" />
        <button type="submit">Upload</button>
      </form>
      {imgUrl && (
        <div>
          <p>Uploaded image:</p>
          <Image src={imgUrl} alt="Uploaded" width={300} height={300} />
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
