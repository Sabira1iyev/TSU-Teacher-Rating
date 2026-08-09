import { useUser } from "@/context/UserContext";
import { useState } from "react";
import ResetPasswordModal from "@/app/[locale]/(auth)/login/newLogin/ResetPasswordModal";

interface ChangeProfileModalAppsProps {
  onClose: () => void;
}

export default function ChangePasswordModa({
  onClose,
}: ChangeProfileModalAppsProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    oldPassword: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const { user } = useUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = () => {
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!formData.oldPassword) {
      setError("Please enter your old password");
      return;
    }
    setShowConfirm(true);
  };

  const confirmAndSave = async () => {
    try {
      const res = await fetch("/api/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.userId,
          password: formData.password,
          oldPassword: formData.oldPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong!");
        return;
      } else {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Change your password</h2>
          <button
            onClick={onClose}
            className="text-text3 hover:text-text cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {showConfirm ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
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
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
                onClick={confirmAndSave}
              >
                Yes
              </button>
            </div>

            {success && (
              <p className="text-xs text-green font-medium mt-2">{success}</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-text2"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-text2"
              >
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-text2"
              >
                Old Password
              </label>
              <input
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                autoComplete="old-password"
                placeholder="Enter your old password"
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
              <span
                className="text-xs text-primary cursor-pointer hover:underline transition-colors font-medium"
                onClick={() => setIsResetPasswordModalOpen(true)}
              >
                Forgot password?
              </span>
            </div>

            {error && <p className="text-xs text-red font-medium">{error}</p>}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text2 hover:bg-bg3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
                onClick={changePassword}
              >
                Change
              </button>
            </div>
          </>
        )}
      </div>

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
