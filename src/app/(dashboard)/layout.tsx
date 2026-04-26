"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Professor } from "@/types/teacher"
import { mockProfessor } from "@/data/mockTeachers"
import { getInitials } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 5.5L8 2l6 3.5V14H2V5.5z" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4" />
        <line x1="11" y1="11" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    label: "Rate",
    href: "/rate",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="8,2 10,6 14,6.5 11,9.5 12,14 8,11.5 4,14 5,9.5 2,6.5 6,6" />
      </svg>
    ),
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3a3.5 3.5 0 016 2c0 4-6 8.5-6 8.5z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
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

  return (
    <div className="min-h-screen bg-bg flex">

      {/* Sidebar desktop */}

      <aside className="hidden lg:flex w-[220px] flex-shrink-0 flex-col bg-bg2 border-r border-border fixed top-0 left-0 h-full z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-border">
          <div className="w-8 h-8 rounded-[9px] bg-primary-dim flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-[15px] text-text"
            style={{
              fontFamily: "Syne, sans-serif",
            }}>Teacher <span className="text-primary">Rating</span></span>
        </div>

        {/* Nav */}

        <nav className="flex flex-col gap-1 flex-1 px-3 py-3">
          <p className="text-[9px] text-text3 uppercase tracking-widest px-2 py-2">Explore</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${isActive
                  ? "bg-primary-dim text-primary font-medium rounded-lg"
                  : "text-text2 hover:bg-bg3 rounded-lg"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>

            )
          })}

          <p className="text-[9px] text-text3 uppercase tracking-widest px-2 py-2 mt-2">Actions</p>
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${isActive
                  ? "bg-primary-dim text-primary font-medium rounded-lg"
                  : "text-text2 hover:bg-bg3 rounded-lg"
                  } `}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-dim flex items-center justify-center text-[10px] text-blue font-medium flex-shrink-0">
              SA
            </div>
          </div>
        </div>
      </aside>

      {/* content */}
      <main className="flex-1 lg:ml-[220px] flex flex-col min-h-screen">

        {/* Desktop topbar */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg2 sticky top-0 z-110">
          <h1 className="font-bold text-[16px] text-text" style={{
            fontFamily: "Syne, sans-serif",
          }}>Dashboard</h1>
          <div className="flex items-center gap-3 bg-bg3 border border-border2 rounded-[9px] px-3 py-2 w-56 cursor-pointer"
            onClick={() => router.push("/search")}
          >
            <span className="text-text3 text-sm">⌕</span>
            <span className="text-[12px] text-text3">Search professor or course...</span>
          </div>
        </div>

        {/* Mobile topbar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-3 border-b border-border bg-bg2 sticky top-0 z-10">
          <span className="font-bold text-[16px] text-text"
            style={{
              fontFamily: "Syne, sans-serif"
            }}
          >Teacher <span className="text-primary">Rating</span>
          </span>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-3 bg-bg3 border border-border2 rounded-[9px] px-3 py-2 w-56 cursor-pointer"
              onClick={() => router.push("/search")}
            >
              <span className="text-text3 text-[12px]">⌕</span>
              <span className="text-text3 text-[12px]">Search professor or course...</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-dim flex items-center justify-center text-[10px] text-blue font-medium cursor-pointer">
              SA
            </div>
          </div>
        </div>

        {/* page content */}
        <div className="flex-1 pb-16 lg:pb-0">
          {children}
        </div>

        {/* Bottom nav mobile */}

        <nav className="flex lg:hidden border-t border-border bg-bg2 fixed bottom-0 left-0 right-0 z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-2 pb-5"
              >
                <span className={
                  isActive
                    ? "text-primary"
                    : "text-text3"
                }>{item.icon}</span>
                <span className={`text-[9px] ${isActive
                  ? "text-primary text-[8px] font-semibold"
                  : "text-text3 text-[10px] font-semibold"
                  }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>



      </main>

    </div>
  )

}
