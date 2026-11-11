"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-14 h-8" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-14 h-8 shrink-0 overflow-hidden rounded-full border border-border shadow-sm cursor-pointer"
    >
      <span
        className={`absolute inset-0 bg-linear-to-b from-sky-400 to-sky-200 transition-opacity duration-500 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="absolute left-2 top-4 w-5 h-2 rounded-full bg-white/90" />
        <span className="absolute left-5 top-2.5 w-4 h-2 rounded-full bg-white/80" />
        <span className="absolute left-3 top-1 w-3 h-1.5 rounded-full bg-white/70" />
      </span>

      <span
        className={`absolute inset-0 bg-linear-to-b from-slate-950 to-indigo-900 transition-opacity duration-500 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="absolute right-3 top-1.5 w-0.5 h-0.5 rounded-full bg-white" />
        <span className="absolute right-6 top-3 w-1 h-1 rounded-full bg-white/80" />
        <span className="absolute right-2 top-5 w-0.5 h-0.5 rounded-full bg-white/90" />
        <span className="absolute right-8 top-1 w-0.5 h-0.5 rounded-full bg-white/70" />
        <span className="absolute right-4 top-6 w-0.5 h-0.5 rounded-full bg-white/60" />
      </span>

      <span
        className={`absolute top-0.5 z-10 flex items-center justify-center w-7 h-7 text-xl leading-none drop-shadow-md transition-all duration-500 ease-in-out ${
          isDark ? "left-0.5 rotate-360" : "left-[calc(100%-1.875rem)] rotate-0"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
