"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, TrendingUp, Globe, Clock } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Operations by day (last 30 days)
      const { data: ops } = await supabase
        .from("processing_history")
        .select("created_at, tool_type, file_size")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Tools stats
      const { data: tools } = await supabase
        .from("popular_tools")
        .select("*");

      setData({
        operations: ops || [],
        tools: tools || [],
      });
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

  // Process data for charts
  const operationsByDay: Record<string, number> = {};
  data?.operations?.forEach((op: any) => {
    const day = new Date(op.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    operationsByDay[day] = (operationsByDay[day] || 0) + 1;
  });

  const chartData = Object.entries(operationsByDay)
    .slice(-14)
    .map(([day, count]) => ({ day, count }));

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-500 mt-1">
          Detailed insights and metrics
        </p>
      </div>

      {/* Operations Timeline */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Operations Timeline</h3>
          <span className="text-xs text-gray-500">Last 14 days</span>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No data yet</div>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {chartData.map((d) => {
              const height = (d.count / maxCount) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition">
                    {d.count}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  />
                  <div className="text-[10px] text-gray-500 -rotate-45 origin-top-left whitespace-nowrap">
                    {d.day}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tools Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold mb-4">Tools Distribution</h3>
          <div className="space-y-3">
            {data?.tools?.map((tool: any) => {
              const total = data.tools.reduce(
                (sum: number, t: any) => sum + t.usage_count,
                0
              );
              const percentage = ((tool.usage_count / total) * 100).toFixed(1);
              return (
                <div key={tool.tool_type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">
                      {tool.tool_type.replace("-", " ")}
                    </span>
                    <span className="text-sm text-gray-500">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Total Operations</span>
              </div>
              <span className="text-lg font-bold">
                {data?.operations?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Avg per Day</span>
              </div>
              <span className="text-lg font-bold">
                {Math.round((data?.operations?.length || 0) / 30)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Tools Active</span>
              </div>
              <span className="text-lg font-bold">{data?.tools?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}