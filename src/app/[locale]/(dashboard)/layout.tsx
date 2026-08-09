"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import LogoutModal from "./LogoutModal";
import NotificationDropDown from "@/components/NotificationDropdown";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  const t = useTranslations("Sidebar");
  const tIndex = useTranslations("Index");
  const tFac = useTranslations("Faculties");
  const locale = useLocale();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useUser();
  const notificationRef = useRef<HTMLDivElement>(null);
  const initials = getInitials(
    user?.firstName || "FirstName",
    user?.lastName || "LastName",
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReporst = async () => {
      const res = await fetch("/api/report");
      const data = await res.json();

      if (user?.isAdmin) {
        setReports(data.reports);
      }
    };
    fetchReporst();
  }, [user]);

  const unreadCount = reports.filter((r) => !r.IsRead).length;

  return (
    <div className="min-h-screen bg-bg flex overflow-x-hidden">
      {/* Sidebar desktop */}

      <aside className="hidden lg:flex w-[220px] flex-shrink-0 flex-col bg-bg2 border-r border-border fixed top-0 left-0 h-full z-10 shadow-[1px_0_8px_rgba(0,40,80,0.04)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div
            className="w-8 h-8 rounded-[9px] bg-primary flex items-center justify-center flex-shrink-0 cursor-pointer"
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
            className="font-bold text-[15px] text-text cursor-pointer"
            style={{
              fontFamily: "Syne, sans-serif",
            }}
          >
            {tIndex("title1")}{" "}
            <span className="text-primary">{tIndex("title2")}</span>
          </span>
        </div>

        {/* Nav */}

        <nav className="flex flex-col gap-1 flex-1 px-3 py-3">
          <p className="text-[9px] text-text3 uppercase tracking-widest px-2 py-2">
            {t("Explorer")}
          </p>
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === `/${locale}${item.href}`;
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${
                  isActive
                    ? "bg-primary-dim text-primary font-medium rounded-lg"
                    : "text-text2 hover:bg-bg3 rounded-lg"
                }`}
              >
                {item.icon}
                {t(item.label)}
              </Link>
            );
          })}

          <p className="text-[9px] text-text3 uppercase tracking-widest px-2 py-2 mt-2">
            {t("Actions")}
          </p>
          {navItems.slice(2).map((item) => {
            const isActive = pathname === `/${locale}${item.href}`;
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${
                  isActive
                    ? "bg-primary-dim text-primary font-medium rounded-lg"
                    : "text-text2 hover:bg-bg3 rounded-lg"
                } `}
              >
                {item.icon}
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex flex-col itemsc-center px-3 py-4 border-t border-border">
          <Link
            href={`/${locale}/profile`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#f8fafc] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary-dim flex items-center justify-center text-[11px] text-primary font-bold flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-text truncate leading-tight group-hover:text-primary transition-colors">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-text3 truncate leading-tight mt-0.5 font-medium">
                {user?.faculty ? tFac(user.faculty) : t("Student Account")}
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
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
            <p className="text-red">{t("logout")}</p>
          </button>
        </div>
      </aside>

      {/* content */}
      <main className="flex-1 lg:ml-[220px] flex flex-col min-h-screen min-w-0">
        {/* Desktop topbar */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg2 sticky top-0 z-[60] shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <h1
            className="font-bold text-[16px] text-text"
            style={{
              fontFamily: "Syne, sans-serif",
            }}
          >
            {t("Dashboard")}
          </h1>
          <div className="flex gap-2 items-center justify-center">
            <LanguageSwitcher />
            <ThemeToggle />
            {user?.isAdmin && (
              <div className="relative flex items-center" ref={notificationRef}>
                <button
                  className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <svg
                    width="24"
                    height="24"
                    stroke="#0060a9"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4C8.5 4 6 6.5 6 10V13.5L4 16H20L18 13.5V10C18 6.5 15.5 4 12 4Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 16C9.5 17.5 10.5 18.5 12 18.5C13.5 18.5 14.5 17.5 14.5 16"
                      stroke="#0060a9"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white pointer-events-none">
                    {unreadCount}
                  </span>
                )}

                {isNotificationOpen && (
                  <NotificationDropDown
                    reports={reports}
                    setReports={setReports}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                )}
              </div>
            )}

            <div
              className="flex items-center gap-3 bg-bg2 border border-border rounded-[9px] px-3 py-2 cursor-pointer hover:border-[#0060a9] transition-colors"
              onClick={() => router.push("/search")}
            >
              <span className="text-text3 text-sm">⌕</span>
              <span className="text-[12px] text-text3">{t("searchD")}</span>
            </div>
          </div>
        </div>
        {/* Mobile topbar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-3 border-b border-border bg-bg2 sticky top-0 z-[60] shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <span
            onClick={() => router.push("/dashboard")}
            className="font-bold text-[16px] text-text cursor-pointer"
            style={{
              fontFamily: "Syne, sans-serif",
            }}
          >
            {tIndex("title1")}{" "}
            <span className="text-primary">{tIndex("title2")}</span>
          </span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {user?.isAdmin ? (
              <div className="relative flex items-center" ref={notificationRef}>
                <button
                  className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <svg
                    width="24"
                    height="24"
                    stroke="#0060a9"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4C8.5 4 6 6.5 6 10V13.5L4 16H20L18 13.5V10C18 6.5 15.5 4 12 4Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 16C9.5 17.5 10.5 18.5 12 18.5C13.5 18.5 14.5 17.5 14.5 16"
                      stroke="#0060a9"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white pointer-events-none">
                    {unreadCount}
                  </span>
                )}

                {isNotificationOpen && (
                  <NotificationDropDown
                    reports={reports}
                    setReports={setReports}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-3 bg-bg2 border border-border rounded-[9px] px-3 py-2 w-full max-w-[140px] sm:max-w-[200px] cursor-pointer"
                onClick={() => router.push("/search")}
              >
                <span className="text-text3 text-[12px]">⌕</span>
                <span className="text-text3 text-[12px]">{t("searchM")}</span>
              </div>
            )}

            <div className="lg:hidden flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-dim flex items-center justify-center text-[10px] text-primary font-medium cursor-pointer">
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
        <nav className="flex lg:hidden border-t border-border bg-bg2 fixed bottom-0 left-0 right-0 z-50 shadow-[0_-1px_4px_rgba(0,40,80,0.04)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={"/" + locale + item.href}
                className="flex-1 flex flex-col items-center gap-1 py-2 pb-5"
              >
                <span className={isActive ? "text-primary" : "text-text3"}>
                  {item.icon}
                </span>
                <span
                  className={`text-[9px] ${
                    isActive
                      ? "text-primary text-[8px] font-semibold"
                      : "text-text3 text-[10px] font-semibold"
                  }`}
                >
                  {t(item.label)}
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
