import { useEffect, useState } from "react";
import styles from "./style.css";
import { useRouter } from "next/navigation";
interface NotificationDropdownProp {
  onClose: () => void;
  reports: any[];
  setReports: any;
}

export default function NotificationDropDown({
  onClose,
  reports,
  setReports,
}: NotificationDropdownProp) {
  const router = useRouter();

  const handleDismiss = async (reportId: string) => {
    try {
      const res = await fetch("/api/report", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reportId: reportId,
        }),
      });
      if (res.ok) {
        setReports((prevReports: any) =>
          prevReports.filter((report: any) => report.ReportId !== reportId),
        );
      }
    } catch (error: any) {}
  };

  return (
    <div className="animate-modal fixed top-16 right-4 w-[min(320px,calc(100vw-2rem))] bg-bg2 border border-border rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] origin-top-right animate-in fade-in zoom-in-95 duration-200 z-[200] overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-semibold text-[15px] text-text">
          Notifications
        </span>
        <button
          className="flex items-center gap-1 text-primary hover:text-[#004a82] text-[13px] font-medium transition-colors cursor-pointer"
          onClick={async () => {
            fetch("/api/report?markAll=true", {
              method: "PUT",
            });
            setReports((prev: any[]) =>
              prev.map((r) => ({ ...r, IsRead: true })),
            );
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 12L7 17L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17L22 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Mark all as read
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-sm text-text3">
            You're all caught up!
          </div>
        ) : (
          reports.map((report) => {
            return (
              <div
                key={report.ReportId}
                className="flex items-start gap-4 p-4 border-b border-[#f0f4f8] hover:bg-bg transition-colors cursor-pointer last:border-0"
              >
                <div className="relative shrink-0">
                  {!report.IsRead && (
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#2563eb] rounded-full border-2 border-white z-10" />
                  )}
                  <div className="w-10 h-10 rounded-lg bg-[#f0f5fa] border border-border flex items-center justify-center text-[#64748b]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 15S7 16 12 14S17 15 20 15V3S17 2 12 4S7 3 4 3V15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 22V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className="flex-1 min-w-0 flex flex-col gap-0.5 pr-2"
                  onClick={() => {
                    router.push(`/professor/${report.ProfessorId}?tab=Reviews`);
                    fetch(
                      "/api/report?reportId=" +
                        report.ReportId +
                        "&isRead=true",
                      {
                        method: "PUT",
                      },
                    );
                    setReports((prev: any[]) =>
                      prev.map((r) =>
                        r.ReportId === report.ReportId
                          ? {
                              ...r,
                              IsRead: true,
                            }
                          : r,
                      ),
                    );
                  }}
                >
                  <p className="gap-1 text-[14px] text-text leading-snug">
                    <span className="font-bold">Review Flagged</span>
                    <span className="text-text3">•</span>
                    <span className="inline-block bg-red-100 text-red-500 px-2 py-0.5 rounded-md text-[12px] mt-1">
                      {report.Reason}
                    </span>
                  </p>

                  <p className="text-[13px] text-[#64748b] italic line-clamp-1 border-l-2 border-border2 pl-2 mt-0.5">
                    "{report.ReviewComment}"
                  </p>
                  <div className="flex justify-between items-center w-full mt-2">
                    <p className="text-[12px] text-text3">
                      {new Date(report.CreatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <button
                      className="text-[11px] font-semibold text-[#64748b] hover:text-red hover:bg-bg3 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDismiss(report.ReportId);
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
