"use client"
import { useTranslations } from "next-intl"
import LanguageSwitcher from "./LanguageSwitcher"
import ThemeToggle from "./ThemeToggle"
import LogoutModal from "@/app/[locale]/(dashboard)/LogoutModal";
import { useEffect, useRef, useState } from "react";

export default function TopMenuMobile({ onClose }: { onClose: () => void }) {

    const refMobile = useRef<HTMLDivElement>(null)
    const sidebar = useTranslations("Sidebar");
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isLogOutOpen) return;

            const target = event.target as HTMLElement;
            if (target.closest("[data-menu-toggle]")) return;

            if (!refMobile.current?.contains(target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLogOutOpen, onClose])
    return (
        <>
            {/* [DÜZƏLİŞ] Logout modalı (z-100) açıqdırsa menyu onun altına düşür (z-50), beləcə modalın
                qaralma+blur qatı menyunun üstünü də örtür. Bağlıdırsa əvvəlki kimi z-200. */}
            <div ref={refMobile} className={`flex flex-col gap-2.5 p-2 animate-modal fixed top-16 right-4 w-[min(160px,calc(100vw-2rem))] bg-bg2 border border-border rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] origin-top-right animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${isLogOutOpen ? "z-50" : "z-200"}`}>
                <LanguageSwitcher />

                <div className="flex justify-center [&>button]:w-full [&>div]:w-full">
                    <ThemeToggle />
                </div>
                <div>
                    <button
                        className="flex items-center justify-center w-full gap-2 px-3 py-1.5 border-none rounded-lg text-xs text-primary bg-bg3 hover:bg-[#fee2e2] font-bold cursor-pointer"
                        onClick={() => setIsLogOutOpen(true)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                            <path d="M9 12h12l-3 -3" />
                            <path d="M18 15l3 -3" />
                        </svg>
                        <p className="text-red">{sidebar("logout")}</p>
                    </button>
                </div>
            </div>

            <LogoutModal
                isOpen={isLogOutOpen}
                onClose={() => setIsLogOutOpen(false)}
            />
        </>
    )
}