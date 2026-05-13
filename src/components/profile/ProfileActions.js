"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/components/auth/auth";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfileActions({ onClose, onEditProfile }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      router.push("/");
    } catch (err) {
      console.error("Logout Failed:", err);
    }
  };

  const menuItems = [
    { label: "Profile", icon: <User size={14} />, onClick: onEditProfile, active: true },
    { label: "Setting", icon: <Settings size={14} />, onClick: null, active: false },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 px-4 pb-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick ?? undefined}
            disabled={!item.active}
            className={`flex items-center gap-4 w-full px-3 py-3 rounded-xl text-left
              text-xs font-medium transition-colors duration-150 group
              ${item.active
                ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                : "text-gray-400 cursor-default"
              }`}
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
              ${item.active
                ? "bg-gray-100 group-hover:bg-gray-200 text-gray-600"
                : "bg-gray-50 text-gray-300"
              }`}>
              {item.icon}
            </span>
            <span className="text-base text-xs">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="flex justify-end px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            text-xs font-medium text-red-500
            border border-red-300 hover:bg-red-50
            transition-colors duration-150"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}