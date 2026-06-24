"use client";

import { useState } from "react";
import { Key, Copy, Eye, EyeOff, Plus, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminApiKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "pk_live_51Hxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      created: "2026-06-01",
      last_used: "2 hours ago",
      requests: 12453,
      status: "active",
    },
    {
      id: "2",
      name: "Development API Key",
      key: "pk_test_51Hxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      created: "2026-05-15",
      last_used: "5 minutes ago",
      requests: 542,
      status: "active",
    },
  ];

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const generateNew = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("New API key generated");
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Keys
          </h1>
          <p className="text-gray-500 mt-1">
            Manage access tokens for the API
          </p>
        </div>
        <button
          onClick={generateNew}
          disabled={generating}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Generate New Key
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-900 dark:text-amber-100">
            Keep your API keys secure
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            Never share your API keys publicly. If compromised, revoke immediately and generate a new one.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Key className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold">{apiKey.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created {apiKey.created} • Last used {apiKey.last_used}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {apiKey.status}
              </span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <code className="flex-1 text-sm font-mono truncate">
                {showKey === apiKey.id
                  ? apiKey.key
                  : apiKey.key.replace(/.(?=.{20})/g, "•")}
              </code>
              <button
                onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                aria-label="Toggle visibility"
              >
                {showKey === apiKey.id ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => copyKey(apiKey.key)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                aria-label="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500">Total Requests</p>
                <p className="text-lg font-bold">
                  {apiKey.requests.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium">{apiKey.created}</p>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  Edit
                </button>
                <button className="px-3 py-1.5 text-sm border border-red-200 dark:border-red-900 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}