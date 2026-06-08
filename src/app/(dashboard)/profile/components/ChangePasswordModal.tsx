import "./style.css";
import { useUser } from "@/context/UserContext";
import { useState } from "react";


interface ChangeProfileModalAppsProps {
  onClose: () => void;
}

export default function ChangePasswordModa({
  onClose,
}: ChangeProfileModalAppsProps) {
  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Change your password</h2>
          <button
            onClick={onClose}
            className="text-text3 hover:text-text cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-[#5a6a7a]"
          >
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
