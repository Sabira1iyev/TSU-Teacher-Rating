import React, { useState, useEffect } from "react";
import { FACULTIES } from "@/lib/constants";
import { useUser } from "@/context/UserContext";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { useTranslations } from "next-intl";
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
  const inputs = useTranslations("Inputs");
  const facultyYear = useTranslations("facultyYear");
  const faculties = useTranslations("Faculties");
  const buttons = useTranslations("Buttons");
  const popups = useTranslations("Popups");

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
        setError(data.message || "Updating went wrong");
        return;
      } else if (user) {
        setUser({
          ...user,
          firstName: formdata.firstName,
          lastName: formdata.lastName,
          faculty: formdata.faculty,
          studyYear: formdata.studyYear,
        });

        setSuccess(data.message);
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="animate-backdrop fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">{buttons("editProfile")}</h2>
          <button
            onClick={onClose}
            className="text-text3 hover:text-text cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {showConfirm ? (
          <div className="animate-backdrop flex flex-col items-center text-center gap-4 py-4">
            <h3 className="text-lg font-bold text-text"> {popups("editTitle")}</h3>
            <p className="text-sm text-text2">
              {popups("editDesc")}
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
              <p className="text-xs text-green font-medium mt-2">
                {success}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-3 mt-2">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 uppercase tracking-wider">
                  {inputs("firstname")}
                </label>
                <input
                  name="firstName"
                  type="text"
                  autoComplete="off"
                  value={formdata.firstName}
                  onChange={handleChange}
                  placeholder={inputs("firstname")}
                  className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 uppercase tracking-wider">
                  {inputs("lastname")}
                </label>
                <input
                  name="lastName"
                  value={formdata.lastName}
                  type="text"
                  autoComplete="off"
                  onChange={handleChange}
                  placeholder={inputs("lastname")}
                  className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text2">
                {inputs("faculty")}
              </label>
              <select
                name="faculty"
                value={formdata.faculty}
                onChange={handleChange}
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  {inputs("selectYear")}
                </option>
                {FACULTIES.filter((f) => f !== "All").map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculties(faculty)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text2">
                {inputs("studyYear")}
              </label>
              <select
                name="studyYear"
                value={formdata.studyYear}
                onChange={handleChange}
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  {inputs("selectYear")}
                </option>
                <option value="1">{facultyYear("1")}</option>
                <option value="2">{facultyYear("2")}</option>
                <option value="3">{facultyYear("3")}</option>
                <option value="4">{facultyYear("4")}</option>
                <option value="5">{facultyYear("5")}</option>
                <option value="5+">{facultyYear("5+")}</option>
                <option value="graduate">{facultyYear("graduate")}</option>
              </select>
            </div>

            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              {buttons("changePassword")}
            </button>

            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-500/60 text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-red-500/20"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              {buttons("deleteAccount")}
            </button>

            {error && (
              <p className="text-xs text-red font-medium">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text2 hover:bg-bg3 transition-colors cursor-pointer"
              >
                {buttons("cancel")}
              </button>
              <button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
                onClick={handleSave}
              >
                {buttons("saveChanges")}
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
