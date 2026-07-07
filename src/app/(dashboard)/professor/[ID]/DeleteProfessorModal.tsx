"use client";

import { useState } from "react";

interface DeleteProfessorModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  professorName: string;
}

export default function DeleteProfessorModal({
  onClose,
  onConfirm,
  professorName,
}: DeleteProfessorModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      console.log(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7l16 0" />
              <path d="M10 11l0 6" />
              <path d="M14 11l0 6" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-text">Delete Professor</h3>
          <p className="text-sm text-text2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text">{professorName}</span>?
            This action cannot be undone. All reviews, ratings and favorites
            related to this professor will be permanently removed.
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-md shadow-red-500/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
