import "./style.css";
import { useUser } from "@/context/UserContext";
import { ReactElement, useState } from "react";

interface ChangeProfileModalAppsProps {
  onClose: () => void;
}

export default function ChangePasswordModa({
  onClose,
}: ChangeProfileModalAppsProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, setUser } = useUser();

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
    setShowConfirm(true);
  };

  const confirmAndSave = async () => {
    try {
    } catch (error) {}
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
              <p className="text-xs text-[#16a34a] font-medium mt-2">
                {success}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-[#5a6a7a]"
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
                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-[#5a6a7a]"
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
                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-[#dc2626] font-medium">{error}</p>
            )}

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
    </div>
  );
}
