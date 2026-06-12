import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  onClose: () => void;
}

export default function DeleteAccountModal({
  onClose,
}: DeleteAccountModalProps) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: user?.userId,
  });
  const handleDelete = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId: user?.userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.mesage || "Failed to delete account");
        return;
      } else {
        setUser(null);
        setSuccess("Account deleted successfully!");
        router.push("/register");
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to delete account");
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <h3 className="text-lg font-bold text-text">Are you sure?</h3>
          <p className="text-sm text-text2">
            Do you really want to delete your account?
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
