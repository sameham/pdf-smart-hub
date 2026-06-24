"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ToolLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  children: ReactNode;
}

export function ToolLayout({
  icon: Icon,
  title,
  description,
  color,
  children,
}: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10 animate-fade-in">
        <div
          className={`inline-flex w-16 h-16 rounded-2xl bg-${color}-100 dark:bg-${color}-900/30 items-center justify-center mb-4`}
        >
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}