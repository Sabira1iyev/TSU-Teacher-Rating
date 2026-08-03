"use client";

import { useState, useEffect } from "react";

export default function ReviewsFilter({ setFilterType, onClose }: any) {
  return (
    <div className="animate-modal flex flex-col absolute right-0 top-11 bg-white border border-border rounded-xl shadow-[0_4px_20px_rgba(0,40,80,0.08)] w-40 z-50 overflow-hidden py-1">
      <button
        onClick={() => {
          setFilterType("newest");
          onClose();
        }}
        className="px-4 py-2 text-[11px] text-left text-text2 hover:text-[#0060a9] hover:bg-[#f8fafb] transition-colors cursor-pointer bg-transparent border-none"
      >
        Newest First
      </button>
      <button
        onClick={() => {
          setFilterType("five_stars");
          onClose();
        }}
        className="px-4 py-2 text-[11px] text-left text-text2 hover:text-[#0060a9] hover:bg-[#f8fafb] transition-colors cursor-pointer bg-transparent border-none"
      >
        Only 5 Stars
      </button>
      <button
        onClick={() => {
          setFilterType("most_liked");
          onClose();
        }}
        className="px-4 py-2 text-[11px] text-left text-text2 hover:text-[#0060a9] hover:bg-[#f8fafb] transition-colors cursor-pointer bg-transparent border-none"
      >
        Most Liked
      </button>
    </div>
  );
}
