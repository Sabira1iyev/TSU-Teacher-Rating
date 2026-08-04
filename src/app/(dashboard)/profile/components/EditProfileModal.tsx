import React, { useState } from "react";
import { FACULTIES } from "@/lib/constants";
import { useUser } from "@/context/UserContext";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
interface EditProfileModalProps {
  onClose: () => void;
}
export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user, setUser } = useUser();
  const [formdata, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    faculty: user?.faculty || "",
    studyYear: user?.studyYear || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSave = () => {
    setError("");
    setSuccess("");
    if (!formdata.firstName || !formdata.lastName) {
      setError("Please enter your name and surname");
      return;
    }

    if (!formdata.faculty) {
      setError("You don't have selected Faculty");
      return;
    }
    if (!formdata.studyYear) {
      setError("Please enter your faculty year");
      return;
    }

    setShowConfirm(true);
  };

  const confirmAndSave = async () => {
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          userId: user?.userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Updating went wrong");
        return;
      } else if (user) {
        setUser({
          ...user,
          firstName: formdata.firstName,
          lastName: formdata.lastName,
          faculty: formdata.faculty,
          studyYear: formdata.studyYear,
        });

        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
      return;
    }

    setSuccess("Everything is valid, saving...");
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-text3 hover:text-text cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {showConfirm ? (
          <div className="animate-backdrop flex flex-col items-center text-center gap-4 py-4">
            <h3 className="text-lg font-bold text-text">Are you sure?</h3>
            <p className="text-sm text-text2">
              Do you really want to save these changes?
            </p>

            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={confirmAndSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              >
                Yes
              </button>
            </div>

            {success && (
              <p className="text-xs text-[#16a34a] font-medium mt-2">
                {success}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-3 mt-2">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  autoComplete="off"
                  value={formdata.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full bg-bg3 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formdata.lastName}
                  type="text"
                  autoComplete="off"
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full bg-bg3 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#5a6a7a]">
                Faculty
              </label>
              <select
                name="faculty"
                value={formdata.faculty}
                onChange={handleChange}
                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  Select your faculty...
                </option>
                {FACULTIES.filter((f) => f !== "All").map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#5a6a7a]">
                Study Year
              </label>
              <select
                name="studyYear"
                value={formdata.studyYear}
                onChange={handleChange}
                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  Select your study year...
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="5+">5+ Year</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>

            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>

            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-500/60 text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-red-500/20"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete account
            </button>

            {error && (
              <p className="text-xs text-[#dc2626] font-medium">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text2 hover:bg-bg3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
      )}

      {isDeleteModalOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
}
