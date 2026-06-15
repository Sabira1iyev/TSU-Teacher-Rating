"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import LogoutModal from "./LogoutModal";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 5.5L8 2l6 3.5V14H2V5.5z" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="7" r="4" />
        <line x1="11" y1="11" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    label: "Rate",
    href: "/rate",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="8,2 10,6 14,6.5 11,9.5 12,14 8,11.5 4,14 5,9.5 2,6.5 6,6" />
      </svg>
    ),
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3a3.5 3.5 0 016 2c0 4-6 8.5-6 8.5z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const { user } = useUser();
  const initials = getInitials(
    user?.firstName || "FirstName",
    user?.lastName || "LastName",
  );

  return (
    <div className="min-h-screen bg-[#f2f5f7] flex overflow-x-hidden">
      {/* Sidebar desktop */}

      <aside className="hidden lg:flex w-[220px] flex-shrink-0 flex-col bg-white border-r border-[#e4eaf0] fixed top-0 left-0 h-full z-10 shadow-[1px_0_8px_rgba(0,40,80,0.04)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div
            className="w-8 h-8 rounded-[9px] bg-[#0060a9] flex items-center justify-center flex-shrink-0 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span
            onClick={() => router.push("/dashboard")}
            className="font-bold text-[15px] text-[#1a2a3a] cursor-pointer"
            style={{
              fontFamily: "Syne, sans-serif",
            }}
          >
            Teacher <span className="text-[#0060a9]">Rating</span>
          </span>
        </div>

        {/* Nav */}

        <nav className="flex flex-col gap-1 flex-1 px-3 py-3">
          <p className="text-[9px] text-[#8a97a4] uppercase tracking-widest px-2 py-2">
            Explore
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${
                  isActive
                    ? "bg-[#e8f1fa] text-[#0060a9] font-medium rounded-lg"
                    : "text-[#5a6a7a] hover:bg-[#f0f4f7] rounded-lg"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <p className="text-[9px] text-[#8a97a4] uppercase tracking-widest px-2 py-2 mt-2">
            Actions
          </p>
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${
                  isActive
                    ? "bg-[#e8f1fa] text-[#0060a9] font-medium rounded-lg"
                    : "text-[#5a6a7a] hover:bg-[#f0f4f7] rounded-lg"
                } `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex flex-col itemsc-center px-3 py-4 border-t border-[#e4eaf0]">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#f8fafc] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#e8f1fa] flex items-center justify-center text-[11px] text-[#0060a9] font-bold flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#1a2a3a] truncate leading-tight group-hover:text-[#0060a9] transition-colors">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-[#8a97a4] truncate leading-tight mt-0.5 font-medium">
                {user?.faculty || "Student Account"}
              </span>
            </div>
          </Link>
          <button
            className="flex items-center w-full gap-2 px-4 py-2 border-none rounded-lg text-xs text-primary bg-[#fef2f2] hover:bg-[#fee2e2]  font-bold cursor-pointer"
            onClick={() => setIsLogOutOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="#dc2626"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
            <p className="text-[#dc2626]">Log Out</p>
          </button>
        </div>
      </aside>

      {/* content */}
      <main className="flex-1 lg:ml-[220px] flex flex-col min-h-screen min-w-0">
        {/* Desktop topbar */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-[#e4eaf0] bg-white sticky top-0 z-90 shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <h1
            className="font-bold text-[16px] text-[#1a2a3a]"
            style={{
              fontFamily: "Syne, sans-serif",
            }}
          >
            Dashboard
          </h1>
          <div
            className="flex items-center gap-3 bg-[#f8fafb] border border-[#d8dfe6] rounded-[9px] px-3 py-2 w-56 cursor-pointer hover:border-[#0060a9] transition-colors"
            onClick={() => router.push("/search")}
          >
            <span className="text-[#8a97a4] text-sm">⌕</span>
            <span className="text-[12px] text-[#8a97a4]">
              Search professor or course...
            </span>
          </div>
        </div>
        {/* Mobile topbar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-3 border-b border-[#e4eaf0] bg-white sticky top-0 z-10 shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <span
            onClick={() => router.push("/dashboard")}
            className="font-bold text-[16px] text-[#1a2a3a] cursor-pointer"
            style={{
              fontFamily: "Syne, sans-serif",
            }}
          >
            Teacher <span className="text-[#0060a9]">Rating</span>
          </span>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-3 bg-[#f8fafb] border border-[#d8dfe6] rounded-[9px] px-3 py-2 flex-1 min-w-0 cursor-pointer"
              onClick={() => router.push("/search")}
            >
              <span className="text-[#8a97a4] text-[12px]">⌕</span>
              <span className="text-[#8a97a4] text-[12px]">
                Search professor or course...
              </span>
            </div>
            <div className="lg:hidden flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#e8f1fa] flex items-center justify-center text-[10px] text-[#0060a9] font-medium cursor-pointer">
                {initials}
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors border-none cursor-pointer"
                onClick={() => setIsLogOutOpen(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M9 12h12l-3 -3" />
                  <path d="M18 15l3 -3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* page content */}
        <div className="flex-1 pb-16 lg:pb-0 overflow-x-hidden min-w-0">
          {children}
        </div>
        {/* Bottom nav mobile */}
        <nav className="flex lg:hidden border-t border-[#e4eaf0] bg-white fixed bottom-0 left-0 right-0 z-50 shadow-[0_-1px_4px_rgba(0,40,80,0.04)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-2 pb-5"
              >
                <span
                  className={isActive ? "text-[#0060a9]" : "text-[#8a97a4]"}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[9px] ${
                    isActive
                      ? "text-[#0060a9] text-[8px] font-semibold"
                      : "text-[#8a97a4] text-[10px] font-semibold"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <LogoutModal
          isOpen={isLogOutOpen}
          onClose={() => setIsLogOutOpen(false)}
        />
      </main>
    </div>
  );
}
