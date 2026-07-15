"use client";
import { uploadToR2 } from "@/lib/upload";

export default function MediaUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = await uploadToR2(file);
      onUpload(url); //sends to validate route
    }
  };

  return <input type="file" accept="image/*,video/*" onChange={handleFile} />;
}
