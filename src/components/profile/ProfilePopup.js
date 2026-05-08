"use client";

import { useState, useEffect } from "react";
import ProfileActions from "./ProfileActions";
import ProfileEdit from "./ProfileEdit";

export default function ProfilePopup({ isOpen, onClose, user, onProfileUpdated }) {
  const [view, setView] = useState("main"); // "main" | "profile"

  useEffect(() => {
    if (!isOpen) setView("main");
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = (user?.name || user?.username || "U").charAt(0).toUpperCase();

  return (
    <>
      {/* Click-outside backdrop — hanya aktif saat view main */}
      {view === "main" && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Popup utama */}
      {view === "main" && (
        <div
          className="absolute right-0 top-12 z-50 w-72
            bg-gray-50 rounded-2xl
            shadow-[0_4px_24px_rgba(0,0,0,0.10)]
            border border-gray-200 overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Avatar + Name */}
          <div className="flex flex-col items-center pt-6 pb-4 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500
              flex items-center justify-center text-white text-2xl font-bold shadow-sm mb-3">
              {initials}
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || user?.username || "Pengguna"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              @{user?.username ?? "username"}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Actions */}
          <ProfileActions
            onClose={onClose}
            onEditProfile={() => setView("profile")}
          />
        </div>
      )}

      {/* Full screen profile edit — render di luar popup */}
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