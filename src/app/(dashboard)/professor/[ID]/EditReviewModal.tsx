"use client";
import "./style.css";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
export default function EditReviewModal({
  reviewId,
  isAdmin,
}: {
  reviewId: string;
  isAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const user = useUser();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-text3 hover:text-white transition-colors cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="5" r="2" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="19" r="2" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-modal flex flex-col absolute right-0 w-32  rounded shadow-lg z-10 gap-1">
          <button className="w-full text-center px-4 py-2 bg-green-600 text-sm hover:bg-green-300 border-none rounded-full cursor-pointer">
            Edit review
          </button>
          <button className="w-full text-center font-bold px-4 py-2 bg-red-400  text-sm hover:bg-red-300 border-none rounded-full cursor-pointer">
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
