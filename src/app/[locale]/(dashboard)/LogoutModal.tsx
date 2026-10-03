import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;

}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const logoutPopup = useTranslations("LogoutPopup");
  const buttons = useTranslations("Buttons");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
    <div className="animate-backdrop fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <h3 className="text-lg font-bold text-text">{logoutPopup("title")}</h3>
          <p className="text-sm text-text2">
            {logoutPopup("desc")}
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bg3 text-text2 hover:bg-border transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              {buttons("cancel")}
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
              onClick={() => handleLogout()}
              disabled={isloading}
            >
              {isloading ? logoutPopup("logging") : buttons("logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
