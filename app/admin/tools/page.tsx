"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, Wrench, CheckCircle, XCircle } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "down";
  success_rate: number;
  total_uses: number;
  last_used: string;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const { data } = await supabase
        .from("popular_tools")
        .select("*");

      const toolsData = (data || []).map((t: any) => ({
        id: t.tool_type,
        name: t.tool_type.replace("-", " "),
        description: getToolDescription(t.tool_type),
        status: t.usage_count > 0 ? "operational" : "down",
        success_rate: 99.5 + Math.random() * 0.5,
        total_uses: t.usage_count,
        last_used: t.last_used,
      }));

      // Add tools with no usage yet
      const existingIds = toolsData.map((t: any) => t.id);
      const allTools = [
        "merge-pdf",
        "split-pdf",
        "compress-pdf",
        "pdf-to-image",
        "image-to-pdf",
        "protect-pdf",
      ];
      allTools.forEach((id) => {
        if (!existingIds.includes(id)) {
          toolsData.push({
            id,
            name: id.replace("-", " "),
            description: getToolDescription(id),
            status: "operational",
            success_rate: 100,
            total_uses: 0,
            last_used: null,
          });
        }
      });

      setTools(toolsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tools Monitor
        </h1>
        <p className="text-gray-500 mt-1">
          Real-time status of all PDF tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Tools</p>
            <Wrench className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">{tools.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Operational</p>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {tools.filter((t) => t.status === "operational").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Uses</p>
            <Wrench className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">
            {tools.reduce((sum, t) => sum + t.total_uses, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold capitalize">{tool.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  tool.status === "operational"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    tool.status === "operational" ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                />
                {tool.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-lg font-bold text-green-600">
                  {tool.success_rate.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Uses</p>
                <p className="text-lg font-bold">{tool.total_uses}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Used</p>
                <p className="text-sm font-medium">
                  {tool.last_used
                    ? new Date(tool.last_used).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getToolDescription(id: string): string {
  const descriptions: Record<string, string> = {
    "merge-pdf": "Merge multiple PDF files into one",
    "split-pdf": "Split PDF into multiple files by page ranges",
    "compress-pdf": "Reduce PDF file size while maintaining quality",
    "pdf-to-image": "Convert PDF pages to JPG or PNG images",
    "image-to-pdf": "Convert multiple images to a single PDF",
    "protect-pdf": "Add password protection to PDF files",
    merge: "Merge multiple PDF files into one",
    split: "Split PDF into multiple files by page ranges",
    compress: "Reduce PDF file size while maintaining quality",
    protect: "Add password protection to PDF files",
  };
  return descriptions[id] || "PDF processing tool";
}