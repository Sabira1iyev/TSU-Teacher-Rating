"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";

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
  const reportPopup = useTranslations("ReportPopup");
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
    <div className="animate-backdrop fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <h3 className="text-lg font-bold text-text">{reportPopup("reportTitle")}</h3>
          <p className="text-sm text-text2">
            {reportPopup("reportDesc")}
          </p>
          <div className="flex flex-col w-full gap-2">
            <label className="text-xs font-medium text-text2 self-start">
              {reportPopup("reason")}
            </label>
            <select
              name=""
              id=""
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="" disabled>
                {reportPopup("selectReason")}
              </option>
              <option value="spam">{reportPopup("spam")}</option>
              <option value="inappropriate">{reportPopup("inappropriate")}</option>
              <option value="irrelevant">{reportPopup("irrelevant")}</option>
              <option value="sharing">{reportPopup("sharing")}</option>
              <option value="other">{reportPopup("other")}</option>
            </select>
            {reason === "other" && (
              <textarea
                name=""
                id=""
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer resize-none"
                placeholder={reportPopup("otherReason")}
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
            <p className="text-xs text-green font-medium mt-2">{success}</p>
          )}

          {error && (
            <p className="text-xs text-red font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
