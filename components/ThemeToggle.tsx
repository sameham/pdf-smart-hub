"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  const options: { value: typeof theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "فاتح", icon: Sun },
    { value: "dark",  label: "داكن", icon: Moon },
    { value: "system", label: "تلقائي", icon: Monitor },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="تغيير المظهر"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105"
      >
        <Icon className="w-4 h-4 transition-transform duration-300" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map(({ value, label, icon: Ic }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors
                ${theme === value
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              <Ic className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
