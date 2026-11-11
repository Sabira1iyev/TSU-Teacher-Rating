"use client"
import { useTranslations } from "next-intl"
import LanguageSwitcher from "./LanguageSwitcher"
import ThemeToggle from "./ThemeToggle"
import LogoutModal from "@/app/[locale]/(dashboard)/LogoutModal";
import { useState } from "react";

export default function TopMenuMobile() {

    const sidebar = useTranslations("Sidebar");
    const [isLogOutOpen, setIsLogOutOpen] = useState(false);

    return (
        <>
        <div className="flex flex-col gap-1 p-2 animate-modal fixed top-16 right-4 w-[min(160px,calc(100vw-2rem))] bg-bg2 border border-border rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] origin-top-right animate-in fade-in zoom-in-95 duration-200 z-200 overflow-hidden">
            <LanguageSwitcher />

            <div className="flex justify-center [&>button]:w-full">
                <ThemeToggle />
            </div>

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

        {/* [DÜZƏLİŞ] Modal menü div-inin DIŞINDA olmalıdır. İçində olanda menünün transform (animate-in/zoom)
            və overflow-hidden xüsusiyyətləri "fixed inset-0"-ı menü qutusuna qıfıllayır. */}
        <LogoutModal
            isOpen={isLogOutOpen}
            onClose={() => setIsLogOutOpen(false)}
        />
        </>
    )
}