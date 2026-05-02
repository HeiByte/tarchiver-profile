"use client";
import { usePathname, useRouter } from "next/navigation";

function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
      ${
        active
          ? "bg-amber-400 text-amber-950 font-bold shadow-sm"
          : "hover:bg-amber-200 text-amber-800"
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
      // Trigger global file upload logic
      document.getElementById("global-file-upload")?.click();
    } else {
      onCreateClick();
    }
  };

  const isDashboardActive = pathname === "/dashboard" || pathname === "/dashboard/";

  return (
    <aside className="w-64 h-screen bg-amber-300 p-6 flex flex-col gap-8 shadow-lg-black">
      {/* Logo */}
      <div className="text-2xl font-bold text-amber-900 flex items-center gap-2  p-6">
        <span className="bg-white p-2 rounded-lg text-base">🚀</span>
        MyApps
      </div>

      {/* List Button/Menu */}
      <nav className="flex flex-col gap-2">
        <SidebarItem 
            icon={isFolderRoute ? "📤" : "+"} 
            label={isFolderRoute ? "Upload Files" : "Create Folder"} 
            onClick={handleTopButtonClick} 
        />
        <SidebarItem icon="🏠" label="Dashboard" active={isDashboardActive} onClick={() => router.push("/dashboard")} />
        <SidebarItem icon="📁" label="My Files" active={isFolderRoute || isDashboardActive} onClick={() => router.push("/dashboard")} />
        <SidebarItem icon="🗑️" label="Trash" />
      </nav>
    </aside>
  );
}
