"use client";
import "./style.css";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import DeleteReviewModal from "./DeleteReviewModal";
export default function EditReviewModal({
  reviewId,
  professorId,
  isAdmin,
  isOwner,
}: {
  reviewId: string;
  professorId: string;
  isAdmin: boolean;
  isOwner: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [isDeleteReviewOpen, setIsDeleteReviewOpen] = useState(false);

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
        <div className="animate-modal flex flex-col absolute right-0 w-32 z-10 gap-1">
          {isOwner && (
            <button
              className="w-full text-center text-white font-semibold px-4 py-2 bg-green-600 text-sm hover:bg-green-300 border-none rounded-full cursor-pointer"
              onClick={() =>
                router.push(
                  `/edit-review/${reviewId}?professorId=${professorId}`,
                )
              }
            >
              Edit review
            </button>
          )}
          <button className="w-full text-center text-white font-semibold px-4 py-2 bg-red-400  text-sm hover:bg-red-300 border-none rounded-full cursor-pointer"
          onClick={() => setIsDeleteReviewOpen(true)}
          >
            Remove
          </button>
        </div>
      )}
       {isDeleteReviewOpen && (
        <DeleteReviewModal onClose={() => setIsDeleteReviewOpen(false)} reviewId={reviewId} professorId = {professorId}/>
      )} 
    </div>
  );
}
