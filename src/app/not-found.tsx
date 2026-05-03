"use client"

import { useRouter } from "next/navigation";



export default function NotFound() {


  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 max-w-md">

        <div className="relative">
          <p className="text-[120px] font-bold leading-none select-none"
            style={{
              fontFamily: "Syne, sans-serif",
              color: "#1a1a24"
            }}
          >
            4<span style={{ color: "#3b82f6" }}>0</span>4
          </p>
        </div>

        <p className="text-5xl -mt-4">🎓</p>

        <h1 className="text-2xl font-bold text-text"
          style={{ fontFamily: "Syne, sans-serif" }}>
          Absent from class
        </h1>

        <p className="text-sm text-text3 leading-relaxed">
          This page has been absent too many times and got dropped. It may have moved, been delated, or never existed in the first place.
        </p>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2.5 bg-primary rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer"
          >Back to Dashboard</button>
        </div>

        <div className="mt-4">
          <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
            Maybe your looking for
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {[
              { label: "Top professors", href: "/dashboard" },
              { label: "Rate a professor", href: "/rate" },
              { label: "My profile", href: "/profile" },
              { label: "Search", href: "/search" },
            ].map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="px-3 py-1.5 bg-bg2 border border-border rounded-lg text-xs text-text2 hover:text-primary hover:border-primary-mid transition-colors cursor-pointer">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
