"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface DeleteReviewModalProps {
  onClose: () => void;
  reviewId: string;
  professorId: string;
}

export default function DeleteReviewModal({
  onClose,
  reviewId,
  professorId,
}: DeleteReviewModalProps) {
  const router = useRouter();
  const user = useUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professorId }),
      });
      if (response.ok) {
        setSuccess("Review deleted successfully.");

        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      } else {
        setError("Failed to delete review!");
        return;
      }
    } catch (err) {
      console.log("Failed to delete review", err);
      setError("Failed to delete review!");
      return;
    } finally {
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <h3 className="text-lg font-bold text-text">Are you sure?</h3>
          <p className="text-sm text-text2">
            Do you really want to delete review?
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              No
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={handleDelete}
            >
              Yes
            </button>
          </div>

          {success && (
            <p className="text-xs text-[#16a34a] font-medium mt-2">{success}</p>
          )}

          {error && (
            <p className="text-xs text-[#dc2626] font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
