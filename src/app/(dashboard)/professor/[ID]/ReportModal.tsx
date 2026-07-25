"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface ReportModalProps {
  onClose: () => void;
  reviewId: string;
}

export default function ReportModal({ onClose, reviewId }: ReportModalProps) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [form, setFormData] = useState();
  const [otherReason, setOtherReason] = useState("");
  const { user } = useUser();

  const handleSubmit = async () => {
    setSuccess("");
    setError("");
    if (!reason) {
      setError("Please select a reason first");
      return;
    }
    if (reason === "other" && !otherReason.trim()) {
      setError("Please explain the reason");
      return;
    }
    try {
      const result = await fetch(`/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: reviewId,
          reason: reason === "other" ? otherReason : reason,
          userId: user?.userId,
        }),
      });
      const data = await result.json();
      if (result.ok) {
        setSuccess("Report submitted successfully");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.error || data.message || "Something went wrong");
        return;
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
      return;
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <h3 className="text-lg font-bold text-text">Report this review</h3>
          <p className="text-sm text-text2">
            Please select why you are reporting this comment
          </p>
          <div className="flex flex-col w-full gap-2">
            <label className="text-xs font-medium text-[#5a6a7a] self-start">
              Reason
            </label>
            <select
              name=""
              id=""
              className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="" disabled>
                Select a reason
              </option>
              <option value="spam">Spam or fake review</option>
              <option value="inappropraite">Inappropriate language</option>
              <option value="irrelevant">Irrelevant content</option>
              <option value="sharing">Sharing personal information</option>
              <option value="other">Other</option>
            </select>
            {reason === "other" && (
              <textarea
                name=""
                id=""
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer resize-none"
                placeholder="Enter a reason..."
                rows={8}
              />
            )}
          </div>
          <div className="flex gap-3 mt-4 w-full">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={handleSubmit}
            >
              Submit report
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
