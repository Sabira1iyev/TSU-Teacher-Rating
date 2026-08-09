import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <h3 className="text-lg font-bold text-text">Log Out</h3>
          <p className="text-sm text-text2">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={() => handleLogout()}
              disabled={isloading}
            >
              {isloading ? "Logging out..." : "Yes, log out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
