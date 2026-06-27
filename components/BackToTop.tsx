"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      className="fixed bottom-6 left-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-110"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
