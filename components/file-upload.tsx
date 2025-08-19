"use-client";

import { FileWithReview } from "@/types/file";
import { useDropzone } from "react-dropzone";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FileIcon, Upload, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { getAiResult } from "@/actions/getAiResult";

interface FileUploadProps {
  value?: FileWithReview[];
  onChange?: (files: FileWithReview[]) => void;
  onRemove?: (file: FileWithReview) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: { [key: string]: string[] };
  disabled?: boolean;
  className?: string;
}

const FileUpload = ({
  value = [],
  onChange,
  onRemove,
  maxFiles = 1,
  maxSize = 20,
  accept = {
    "image/*": [".jpeg", ".jpg", ".gif", ".webp"],
    "applications/pdf": [".pdf"],
  },
  disabled = false,
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithReview[]>(value);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [aiResult, setAiResult] = useState<string>("");

  const createFilePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const simulateUpload = (fileWithPreview: FileWithReview) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === fileWithPreview.file
            ? { ...f, progress: Math.min(progress, 100) }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === fileWithPreview.file ? { ...f, succees: true } : f
          )
        );
      }
    }, 100);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: FileWithReview[] = [];

      for (const file of acceptedFiles) {
        if (files.length + newFiles.length >= maxFiles) {
          break;
        }

        const preview = await createFilePreview(file);

        const FileWithPreview: FileWithReview = {
          file,
          preview,
          progress: 0,
        };

        newFiles.push(FileWithPreview);
        simulateUpload(FileWithPreview);
      }

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, maxFiles, onChange]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSize * 1024 * 1024,
    multiple: true,
    disabled: disabled || files.length >= maxFiles,
  });

  const handleRemove = useCallback(
    (fileToRemove: FileWithReview) => {
      const updatedFiles = files.filter((f) => f.file !== fileToRemove.file);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
      onRemove?.(fileToRemove);
    },
    [files, onRemove, onChange]
  );

  const onSubmit = async () => {
    setIsLoading(true);
    const result = await getAiResult(prompt, files[0].file);

    setAiResult(result);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {aiResult && <p>{aiResult}</p>}
      <Textarea
        rows={10}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Drag and drop File</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-32 p-4 border-2 border-dashed rounded-lg transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              disabled && "opacity-50 cursor-not-allowed",
              "hover: bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="size-8 mb-2 text-muted-foreground " />
              <p className="text-sm font-medium">
                Drag files here or click to upload
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.file.name} - ${index}`}
                  className="flex items-center p-2 border rounded-lg"
                >
                  <div className="flex items-center flex-1 min-w-0 gap-2">
                    {file.preview ? (
                      <div className="relative size-10 overflow-hidden rounded">
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div>
                        <FileIcon className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="ml-2 size-8"
                    onClick={() => handleRemove(file)}
                    disabled={disabled}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between">
            <p className="text-xs text-muted-foreground">{`${
              files.filter((f) => !f.error).length
            }/${maxFiles} files uploaded`}</p>
            <div>
              <Button disabled={isLoading} onClick={onSubmit}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "submit"
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FileUpload;
