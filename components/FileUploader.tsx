"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  className?: string;
}

export function FileUploader({
  accept = ".pdf,image/*",
  multiple = false,
  maxSize = 50,
  files,
  onFilesChange,
  className,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (newFiles: File[]) => {
      const valid: File[] = [];
      for (const file of newFiles) {
        if (file.size > maxSize * 1024 * 1024) {
          setError(`الملف "${file.name}" أكبر من ${maxSize} ميجابايت`);
          continue;
        }
        valid.push(file);
      }
      return valid;
    },
    [maxSize]
  );

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      setError(null);
      const fileArray = Array.from(newFiles);
      const validFiles = validate(fileArray);

      if (multiple) {
        onFilesChange([...files, ...validFiles]);
      } else {
        onFilesChange(validFiles.slice(0, 1));
      }
    },
    [files, multiple, onFilesChange, validate]
  );

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, dir: 1 | -1) => {
    if (!multiple) return;
    const newFiles = [...files];
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= files.length) return;
    [newFiles[index], newFiles[newIdx]] = [newFiles[newIdx], newFiles[index]];
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-all",
          dragOver
            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          اسحب الملفات هنا أو انقر للاختيار
        </p>
        <p className="text-sm text-gray-500 mt-1">
          الحد الأقصى {maxSize} ميجابايت لكل ملف
        </p>
      </label>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon className="w-5 h-5 text-pink-500 flex-shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
              </div>
              {multiple && files.length > 1 && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveFile(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                    aria-label="نقل للأعلى"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(idx, 1)}
                    disabled={idx === files.length - 1}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                    aria-label="نقل للأسفل"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => removeFile(idx)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                aria-label="حذف الملف"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}