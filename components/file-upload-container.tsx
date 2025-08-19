"use client";

import { FileWithReview } from "@/types/file";
import FileUpload from "./file-upload";
import { useState } from "react";
import { toast } from "sonner";

const FileUploadContainer = () => {
  const [files, setFiles] = useState<FileWithReview[]>([]);

  const handleChange = (newFiles: FileWithReview[]) => {
    setFiles(newFiles);
  };

  const handleRemove = (file: FileWithReview[]) => {
    toast;
  };

  return (
    <div className="w-full">
      <FileUpload
        value={files}
        onChange={handleChange}
        onRemove={handleRemove}
        maxFiles={1}
        maxSize={20}
        accept={{
          "image/*": [".jpeg", ".jpg", ".gif", ".webp"],
          "applications/pdf": [".pdf"],
        }}
      />
    </div>
  );
};

export default FileUploadContainer;
