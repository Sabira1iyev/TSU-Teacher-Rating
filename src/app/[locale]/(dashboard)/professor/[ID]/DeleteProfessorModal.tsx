"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FACULTY_COLORS, DEFAULT_FACULTY_COLOR } from "@/lib/constants";
import { Professor } from "@/types/teacher";

interface DeleteProfessorModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  professorName: string;
  faculty: Professor["faculty"];
}

export default function DeleteProfessorModal({
  onClose,
  onConfirm,
  professorName,
   faculty,
}: DeleteProfessorModalProps) {

  const [isDeleting, setIsDeleting] = useState(false);
  const popups = useTranslations("Popups");
  const buttons = useTranslations("Buttons");
  const fc = FACULTY_COLORS[faculty] 
   || DEFAULT_FACULTY_COLOR;

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
    <div className="animate-backdrop fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
          <h3 className="text-lg font-bold text-text">{popups("deleteProf")}</h3>
          <p className="text-sm text-text2">
            {
              popups.rich("deleteProfConfirm", {
                name: (chunks) => (
                  <span className="font-bold" style={{
                    color: fc.primary,
                  }}>{chunks}</span>
                ),
                professorName,
              })
            }

            {popups("deleteProfDesc")}
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              onClick={onClose}
              disabled={isDeleting}
            >
              {buttons("cancel")}
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-md shadow-red-500/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? buttons("deleting") : buttons("yesDelete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
