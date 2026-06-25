"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Users,
  Activity,
  TrendingUp,
  HardDrive,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface AdminStats {
  total_users: number;
  new_users_24h: number;
  new_users_7d: number;
  total_operations: number;
  operations_24h: number;
  operations_7d: number;
  failed_operations: number;
  total_bytes_processed: number;
  active_admins: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [popularTools, setPopularTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get stats
      const { data: statsData } = await supabase
        .from("admin_stats")
        .select("*")
        .single();

      setStats(statsData);

      // Get popular tools
      const { data: toolsData } = await supabase
        .from("popular_tools")
        .select("*")
        .limit(6);

      setPopularTools(toolsData || []);
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

  const STATS_CARDS = [
    {
      label: "Total Users",
      value: stats?.total_users || 0,
      change: `+${stats?.new_users_24h || 0} today`,
      changeType: "up" as const,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Operations",
      value: stats?.total_operations || 0,
      change: `+${stats?.operations_24h || 0} today`,
      changeType: "up" as const,
      icon: Activity,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Data Processed",
      value: formatBytes(stats?.total_bytes_processed || 0),
      change: "Last 30 days",
      changeType: "neutral" as const,
      icon: HardDrive,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Failed Operations",
      value: stats?.failed_operations || 0,
      change: "Needs attention",
      changeType: stats?.failed_operations ? "down" as const : "neutral" as const,
      icon: AlertCircle,
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.changeType === "up" && (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                )}
                {stat.changeType === "down" && (
                  <ArrowDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Tools */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold mb-4">Popular Tools (Last 30 days)</h3>
          {popularTools.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data yet
            </div>
          ) : (
            <div className="space-y-3">
              {popularTools.map((tool, idx) => {
                const max = popularTools[0]?.usage_count || 1;
                const percentage = (tool.usage_count / max) * 100;
                return (
                  <div key={tool.tool_type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-5">
                          #{idx + 1}
                        </span>
                        <span className="font-medium capitalize">
                          {tool.tool_type.replace("-", " ")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {tool.usage_count.toLocaleString()} uses
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                New Users (7d)
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                {stats?.new_users_7d || 0}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Operations (7d)
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                {stats?.operations_7d || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                Active Admins
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                {stats?.active_admins || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}