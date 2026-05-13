"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpenDot,
  Upload,
  DatabaseBackup,
} from "lucide-react";

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
  const isBackupsRoute = pathname === "/dashboard/backups";

  const handleTopButtonClick = () => {
    if (isFolderRoute) {
      document.getElementById("global-file-upload")?.click();
    } else {
      onCreateClick();
    }
  };

  const isDashboardActive =
    !isBackupsRoute &&
    (pathname === "/dashboard" || pathname === "/dashboard/");

  return (
    <aside className="w-48 h-screen bg-[#1E293B] p-4 flex flex-col gap-8 shadow-lg shadow-black">
      {/* Logo */}
      <div className="text-2xl font-bold text-white flex items-center gap-2 p-6">
        <img
          src="logo2.png"
          alt="MyApps Logo"
          className="w-20 h-20 ml-4 object-contain"
        />
      </div>

      {/* List Button/Menu */}
      <nav className="flex flex-col gap-2 text-white items-center text-xs">
        {!isBackupsRoute && (
          <SidebarItem
            icon={isFolderRoute ? <Upload /> : "Create +"}
            label={isFolderRoute ? " " : " "}
            onClick={handleTopButtonClick}
            customBg="bg-[#3B82F6] text-white justify-center items-center rounded-xl px-4 py-2 transition-all duration-200 hover:bg-[#357AE8] active:bg-[#2F6FD6] active:scale-[0.98] shadow-md hover:shadow-lg"
          />
        )}

        <SidebarItem
          icon={<LayoutDashboard fill="white" />}
          label="Dashboard"
          active={isDashboardActive}
          onClick={() => router.push("/dashboard")}
        />

        <SidebarItem
          icon={<FolderOpenDot fill="white" />}
          label="My Files"
          active={isFolderRoute}
          onClick={() => router.push("/dashboard")}
        />

        <SidebarItem
          icon={<DatabaseBackup fill="white" />}
          label="Backups"
          active={isBackupsRoute}
          onClick={() => router.push("/dashboard/backups")}
        />
      </nav>
    </aside>
  );
}
