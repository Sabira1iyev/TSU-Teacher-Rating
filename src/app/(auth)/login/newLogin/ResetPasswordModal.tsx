"use client";

import React, { useState } from "react";

export default function ResetPasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSent = async () => {};

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">
            Email will be sent this email
          </h2>
          <button
            onClick={onClose}
            className="text-text3 hover:text-text cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-[#5a6a7a]"
            >
              Email
            </label>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="@.tsu.edu.ge"
              className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
          </div>

          {/* {error && (
              <p className="text-xs text-[#dc2626] font-medium">{error}</p>
            )} */}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text2 hover:bg-bg3 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={handleSent}
            >
              Sent Code
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
