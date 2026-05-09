"use client";

import { useState, useEffect } from "react";
import ProfileActions from "./ProfileActions";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePopup({ isOpen, onClose, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user?.name]);

  if (!isOpen) return null;

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });

      if (error) throw error;
      
      setIsEditing(false);
      window.location.reload(); 
    } catch (err) {
      alert("Gagal memperbarui nama: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-20 h-20 bg-blue-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold">
            {newName.charAt(0)}
          </div>
        </div>

        {/* Name & Info */}
        <div className="text-center px-6 pb-2">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1 border rounded-md text-sm text-black"
                autoFocus
              />
              <div className="flex justify-center gap-2">
                <button 
                  onClick={handleUpdateName}
                  disabled={loading}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                >
                  {loading ? "..." : "Simpan"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-xs bg-gray-200 px-2 py-1 rounded text-black"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight flex items-center justify-center gap-2">
                {user?.name ?? "Nama Pengguna"}
                <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                  </svg>
                </button>
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                @{user?.username ?? "username"}
              </p>
            </>
          )}
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