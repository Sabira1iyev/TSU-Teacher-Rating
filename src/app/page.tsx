"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {

  const router = useRouter();
  const [progress, setProgress] = useState(0);


  useEffect(() => {

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f5f7] relative overflow-hidden">

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] 
      rounded-full bg-[#0060a9]/8 
      blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">

        <div className="w-16 h-16 rounded-2xl bg-[#e8f1fa] border border-[#c8ddf0] flex items-center justify-center">

          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0060a9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="font-bold text-4xl text-[#1a2a3a] tracking-tight">
            Teacher <span className="text-[#0060a9]">Rating</span>
          </h1>
          <p className="text-[#8a97a4] text-sm mt-2 tracking-wide">
            Tbilisi State University
          </p>
          <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mx-auto mt-3" />
        </div>

        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="w-28 h-[3px] bg-[#d8dfe6] rounded-full overflow-hidden">
            <div className="h-full bg-[#0060a9] rounded-full"
              style={{
                animation: "loadingBar 2.5s ease-in-out forwards",
              }}
            />
          </div>
          <p className="text-[#8a97a4] text-xs animate-pulse">
            Loading...
          </p>
        </div>
      </div>

      <p className="absolute bottom-8 text-[#8a97a4] text-xs font-bold text-center px-4">
        Only for verified TSU students.
      </p>
    </div>

  );
}
