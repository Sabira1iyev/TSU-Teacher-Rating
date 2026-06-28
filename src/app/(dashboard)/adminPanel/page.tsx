"use client";
import { useState } from "react";
import { UserPlus, BarChart, ShieldAlert, ArrowLeft } from "lucide-react";

type AdminTap = "menu" | "addProfessor" | "analytics" | "usersManagment";

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<AdminTap>("menu");

  const menuItems = [
    {
      id: "addProfessor",
      title: "Add Professor",
      description: "Add new professor to the site",
      icon: <UserPlus className="w-8 h-9 text-[#0060a9]" />,
      bg: "bg-[#e8f1fa]",
    },
    {
      id: "analytics",
      title: "Show Analytics",
      description: "Show analytics about site",
      icon: <BarChart className="w-8 h-8 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      id: "manageAdmins",
      title: "Give Admin Role",
      description: "Give admin role to other users or take back",
      icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        {activeTab !== "menu" && (
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e4eaf0] hover:bg[#f8fafb] transition-colors cursor-pointer"
            onClick={() => setActiveTab("menu")}
          >
            <ArrowLeft className="w-5 h-5 text-[#5a6a7a]" />
          </button>
        )}
        <div className="flex flex-col w-full items-center">
          <h1 className="text-2xl font-bold text-[#1a2a3a]">
            Admin Control Center
          </h1>
          <p className="text-sm text-[#8a97a4]">
            Manage the system, view analytics, edit roles.
          </p>
        </div>
      </div>
      {activeTab === "menu" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTap)}
              className="bg-white border border-[#e4eaf0] rounded-2xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            >
              <div
                className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.bg} group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1a2a3a] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text=[#8a97a4] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
