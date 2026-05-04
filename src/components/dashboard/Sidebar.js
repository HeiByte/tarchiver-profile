"use client";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderOpenDot, Trash, Upload } from "lucide-react";


function SidebarItem({ icon, label, active = false, onClick, customBg }) {
  return (
    <button
      onClick={onClick}
      className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-white
      ${
        customBg
          ? customBg
          : active
            ? "bg-[#485F70] text-white font-bold shadow-sm"
            : "hover:bg-[#758da0] text-white"
      }
    `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar({ onCreateClick }) {
  const pathname = usePathname();
  const router = useRouter();

  const isFolderRoute = pathname?.startsWith("/dashboard/folder/");

  const handleTopButtonClick = () => {
    if (isFolderRoute) {
      document.getElementById("global-file-upload")?.click();
    } else {
      onCreateClick();
    }
  };

  const isDashboardActive =
    pathname === "/dashboard" || pathname === "/dashboard/";

  return (
    <aside className="w-64 h-screen bg-[#1E293B] p-6 flex flex-col gap-8 shadow-lg-black">
      {/* Logo */}
      <div className="text-2xl font-bold text-white flex items-center gap-2  p-6">
        <img
          src="logo2.png"
          alt="MyApps Logo"
          className="w-30 h-30 ml-4 object-contain"
        />
      </div>

      {/* List Button/Menu */}
      <nav className="flex flex-col gap-2 text-white items-center">
        <SidebarItem
          icon={isFolderRoute ? <Upload /> : "+"}
          label={isFolderRoute ? " " : " "}
          onClick={handleTopButtonClick}
          customBg="bg-[#3B82F6] flex justify-center items-center text-2xl"
        />
        <SidebarItem
          icon={<LayoutDashboard fill="white" />}
          label="Dashboard"
          active={isDashboardActive}
          onClick={() => router.push("/dashboard")}
        />
        <SidebarItem
          icon={<FolderOpenDot fill="white" />}
          label="My Files"
          active={isFolderRoute || isDashboardActive}
          onClick={() => router.push("/dashboard")}
        />
        <SidebarItem icon={<Trash fill="white" />} label="Trash" />
      </nav>
    </aside>
  );
}
