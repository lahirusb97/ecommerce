import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductImageUploader({
  value,
  publicId,
  onUploaded,
  onPublicIdChange,
}: {
  value?: string;
  publicId?: string;
  onUploaded: (url: string) => void;
  onPublicIdChange: (publicId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // 1. Destroy old image if it exists
    if (publicId) {
      await fetch("/api/delete-img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });
    }
    // 2. Upload new image
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    // 3. Save new image data
    if (data.url && data.public_id) {
      onUploaded(data.url);
      onPublicIdChange(data.public_id);
    }

    setUploading(false);
  }

  return (
    <div className="space-y-2 flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        disabled={uploading}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
      </Button>

      {value && (
        <img src={value} alt="variant" width={60} className="rounded shadow" />
      )}
    </div>
  );
}
