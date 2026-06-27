"use client";

import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { ProcessState } from "@/hooks/usePDFProcessor";
import { cn } from "@/lib/utils";

export function ProcessingStatus({ state }: { state: ProcessState }) {
  if (state.status === "idle") return null;

  const variants = {
    processing:
      "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    success:
      "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
    error: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
  };

  const iconColors = {
    processing: "text-blue-600",
    success: "text-green-600",
    error: "text-red-600",
  };

  const messages = {
    processing: "جاري المعالجة...",
    success: "تمت العملية بنجاح!",
    error: state.error || "حدث خطأ",
  };

  return (
    <div className={cn("p-4 rounded-xl border animate-fade-in", variants[state.status])}>
      <div className="flex items-center gap-3">
        {state.status === "processing" && (
          <Loader2 className={cn("w-5 h-5 animate-spin", iconColors.processing)} />
        )}
        {state.status === "success" && (
          <CheckCircle2 className={cn("w-5 h-5", iconColors.success)} />
        )}
        {state.status === "error" && (
          <XCircle className={cn("w-5 h-5", iconColors.error)} />
        )}

        <div className="flex-1">
          <p className="font-medium">{messages[state.status]}</p>

          {state.status === "processing" && (
            <div className="mt-2 h-2 bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          )}
        </div>

        {state.status === "processing" && (
          <span className="text-sm font-medium tabular-nums">
            {state.progress}%
          </span>
        )}
      </div>
    </div>
  );
}