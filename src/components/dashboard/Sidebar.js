"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  FolderOpenDot,
  Upload,
  DatabaseBackup,
  HardDrive,
  Menu, X,
} from "lucide-react";

const STORAGE_LIMIT_BYTES = 262144000; // 250MB

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function getBarColor(percent) {
  if (percent >= 90) return "bg-red-500";
  if (percent >= 70) return "bg-yellow-400";
  return "bg-[#3B82F6]";
}

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

function StorageBar() {
  const [usage, setUsage] = useState(null);

  const fetchUsage = useCallback(() => {
    fetch("/api/storage/usage")
      .then((r) => r.json())
      .then((data) => setUsage(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Fetch on mount
    fetchUsage();
    window.addEventListener("storage_update", fetchUsage);

    // Untuk tab lain
    const channel = new BroadcastChannel("storage_update");
    channel.onmessage = () => fetchUsage();

    return () => {
      window.removeEventListener("storage_update", fetchUsage);
      channel.close();
    };
  }, [fetchUsage]);

  const percent = usage?.percentUsed ?? 0;
  const barColor = getBarColor(percent);

  return (
    <div className="px-2 py-3 border-t border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <HardDrive className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
        <span className="text-[10px] text-white/60 font-medium">Storage</span>
        {percent >= 90 && (
          <span className="ml-auto text-[9px] font-bold text-red-400">
            Almost Full
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-white/40">
          {usage ? formatBytes(usage.used) : "—"}
        </span>
        <span className="text-[10px] text-white/40">250 MB</span>
      </div>
    </div>
  );
}

export default function Sidebar({ onCreateClick }) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
    <button onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-50 md:hidden bg-[#1e293b] text-white p-2 rounded-lg shadow-lg">
      <Menu className="w-6 h-6"/>
    </button>

    <aside className={`fixed md:static top-0 left-0 z-50 w-64 md:w-48 h-screen bg-[#1e293b] p-4 flex flex-col gap-8 shadow-lg shadow-black transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "tranlate-x-full"} md:translate-x-0`}>

      <div className="flex justify-end md:hidden">
        <button onClick={() => setMobileOpen(false)}>
          <X className="w-6 h-6 text-white"/>
        </button>
      </div>
      {/* Logo */}
      <div className="text-2xl font-bold text-white flex items-center gap-2 p-6">
        <img
          src="logo2.png"
          alt="MyApps Logo"
          className="w-20 h-20 ml-4 object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 text-white items-center text-xs flex-1">
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
          onClick={() => {
            router.push("/dashboard");
            setMobileOpen(false);
          }}
        />

        <SidebarItem
          icon={<FolderOpenDot fill="white" />}
          label="My Files"
          active={isFolderRoute}
          onClick={() => {
            router.push("/dashboard");
            setMobileOpen(false);
          }}
        />

        <SidebarItem
          icon={<DatabaseBackup fill="white" />}
          label="Backups"
          active={isBackupsRoute}
          onClick={() => {
            router.push("/dashboard/backups");
            setMobileOpen(false);
          }}
        />
      </nav>

      <StorageBar />
    </aside>
    </>
  );
}