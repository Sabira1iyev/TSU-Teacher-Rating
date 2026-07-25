import { useEffect, useState } from "react";

interface NotificationDropdownProp {
  onClose: () => void;
}

export default function NotificationDropDown({
  onClose,
}: NotificationDropdownProp) {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReporst = async () => {
      const res = await fetch("/api/report");
      const data = await res.json();

      if (res.ok) {
        setReports(data.reports);
      }
    };
    fetchReporst();
  }, []);

  return (
    <div className="fixed top-16 right-4 w-[min(320px,calc(100vw-2rem))] bg-white border border-[#e4eaf0] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] origin-top-right animate-in fade-in zoom-in-95 duration-200 z-[200] overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e4eaf0]">
        <span className="font-semibold text-[15px] text-[#1a2a3a]">
          Notifications
        </span>
        <button className="flex items-center gap-1 text-[#0060a9] hover:text-[#004a82] text-[13px] font-medium transition-colors">
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
          <div className="p-8 text-center text-sm text-[#8a97a4]">
            You're all caught up!
          </div>
        ) : (
          reports.map((report, index) => {
            return (
              <div
                key={report.ReportId}
                className="flex items-start gap-4 p-4 border-b border-[#f0f4f8] hover:bg-[#f8fafb] transition-colors cursor-pointer last:border-0"
              >
                <div className="relative shrink-0">
                  {index === 0 && (
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#2563eb] rounded-full border-2 border-white z-10" />
                  )}
                  <div className="w-10 h-10 rounded-lg bg-[#f0f5fa] border border-[#e4eaf0] flex items-center justify-center text-[#64748b]">
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

                <div className="flex flex-col gap-0.5 pr-2">
                  <p className="gap-1 text-[14px] text-[#1a2a3a] leading-snug">
                    <span className="font-bold">Review Flagged</span>
                    <span className="text-[#8a97a4]">•</span>
                    <span className="inline-block bg-red-100 text-red-500 px-2 py-0.5 rounded-md text-[12px] mt-1">
                      {report.Reason}
                    </span>
                  </p>

                  <p className="text-[13px] text-[#64748b] italic line-clamp-1 border-l-2 border-[#d8dfe6] pl-2 mt-0.5">
                    "{report.ReviewComment}"
                  </p>

                  <p className="text-[12px] text-[#8a97a4] mt-1">
                    {new Date(report.CreatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
