"use client";

import { useState, useEffect } from "react";
import ProfileActions from "./ProfileActions";
import ProfileEdit from "./ProfileEdit";

export default function ProfilePopup({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}) {
  const [view, setView] = useState("main");

  useEffect(() => {
    if (!isOpen) setView("main");
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = (user?.name || user?.username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {view === "main" && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {view === "main" && (
        <div
          className="absolute right-0 top-10 z-50 w-60
          bg-gray-50 rounded-xl
          shadow-[0_4px_20px_rgba(0,0,0,0.10)]
          border border-gray-200 overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
      
          <div className="flex flex-col items-center pt-4 pb-3 px-4">
         
            <div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-500
            flex items-center justify-center text-white text-xl font-bold shadow-sm mb-2"
            >
              {initials}
            </div>

            <p className="text-sm font-semibold text-gray-800 text-center truncate w-full">
              {user?.name || user?.username || "Pengguna"}
            </p>
            <p className="text-[10px] text-gray-400 mt-0">
              @{user?.username ?? "username"}
            </p>
          </div>

  
          <div className="border-t border-gray-200" />

          <ProfileActions
            onClose={onClose}
            onEditProfile={() => setView("profile")}
          />
        </div>
      )}

      {view === "profile" && (
        <ProfileEdit
          user={user}
          onBack={() => setView("main")}
          onSaved={() => {
            setView("main");
            if (onProfileUpdated) onProfileUpdated();
          }}
        />
      )}
    </>
  );
}
