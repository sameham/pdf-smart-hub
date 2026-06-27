"use client";

import { useState, useCallback } from "react";

export interface ProcessState {
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  message?: string;
  error?: string;
}

type ProcessorFn<TInput, TOutput> = (
  input: TInput,
  onProgress?: (progress: number) => void
) => Promise<TOutput>;

export function usePDFProcessor<TInput, TOutput>(
  processor: ProcessorFn<TInput, TOutput>
) {
  const [state, setState] = useState<ProcessState>({
    status: "idle",
    progress: 0,
  });

  const process = useCallback(
    async (input: TInput): Promise<TOutput> => {
      setState({ status: "processing", progress: 0 });
      try {
        const result = await processor(input, (progress) =>
          setState((prev) => ({ ...prev, progress }))
        );
        setState({ status: "success", progress: 100 });
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        setState({ status: "error", progress: 0, error });
        throw err;
      }
    },
    [processor]
  );

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0 });
  }, []);

  return { state, process, reset };
}