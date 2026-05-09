"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ProfilePopup from "../profile/ProfilePopup";
import { createClient } from "@/utils/supabase/client";

export default function NavDash() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState({ name: "Nama", username: "" });
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        setUser({
          name: sbUser.user_metadata?.full_name || "Tanpa Nama",
          username: sbUser.email.split('@')[0],
          email: sbUser.email
        });
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex justify-between items-center mb-8 shadow-md bg-white p-6 sticky top-0 z-50">
      {/* Search Bar */}
      <div className="relative w-1/2">
        {/* Ikon Search */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-black" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search files..."
          className="block w-full pl-10 pr-4 py-2 bg-white text-[#5D78A4] placeholder-[#5D78A4]/60 rounded-lg border border-blue-400 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        />
      </div>

      {/* Profil */}
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-16 h-16 bg-blue-400 rounded-full border-2 border-white shadow-sm hover:ring-4 hover:ring-blue-100 transition-all overflow-hidden"
        >
          {/* Bisa pakai <img> jika ada URL foto */}
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
            {user.name.charAt(0)}
          </div>
        </button>

        <ProfilePopup
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
        />
      </div>
    </div>
  );
}

