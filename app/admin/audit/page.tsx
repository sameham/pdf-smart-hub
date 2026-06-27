"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, ScrollText, Activity } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data } = await supabase
        .from("admin_audit_log")
        .select("*, admin:admin_id(email)")
        .order("created_at", { ascending: false })
        .limit(100);

      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("delete") || action.includes("ban")) return "red";
    if (action.includes("create") || action.includes("add")) return "green";
    if (action.includes("update") || action.includes("edit")) return "blue";
    return "gray";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Audit Log
        </h1>
        <p className="text-gray-500 mt-1">
          All admin actions tracked for security
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ScrollText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No audit logs yet</p>
            <p className="text-xs mt-1">Actions will appear here as admins use the system</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {logs.map((log) => {
              const color = getActionColor(log.action);
              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        color === "red"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : color === "green"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Activity
                        className={`w-4 h-4 ${
                          color === "red"
                            ? "text-red-600"
                            : color === "green"
                            ? "text-green-600"
                            : color === "blue"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{log.action}</p>
                        {log.target_type && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                            {log.target_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {log.admin?.email || "Unknown"} •{" "}
                        {formatDate(log.created_at)}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <pre className="mt-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}