"use client";

import ProfileActions from "./ProfileActions";

export default function ProfilePopup({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popup Card */}
      <div
        className="
          absolute right-0 top-20 z-[9999]
          w-72 bg-white rounded-2xl shadow-2xl border border-gray-100
          animate-in fade-in slide-in-from-top-2 duration-200
          overflow-hidden
        "
        role="dialog"
        aria-modal="true"
        aria-label="Profil pengguna"
      >
        {/* Header gradient */}
        <div className="h-20 bg-gradient-to-br from-blue-400 to-blue-600 relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
                                radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-10 mb-3">
          <div className="w-20 h-20 bg-blue-400 rounded-full border-4 border-white shadow-lg" />
        </div>

        {/* Name & Info */}
        <div className="text-center px-6 pb-2">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            {user?.name ?? "Nama Pengguna"}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {user?.email ?? "user@email.com"}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 my-3 border-t border-gray-100" />

        {/* Action Buttons */}
        <ProfileActions onClose={onClose} />

        <div className="h-4" />
      </div>
    </>
  );
}