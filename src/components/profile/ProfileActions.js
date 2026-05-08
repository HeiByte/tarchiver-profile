"use client";

import { useRouter } from "next/navigation";
import {logout} from "@/components/auth/auth";
const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
  </svg>
);

const SettingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function ProfileActions({ onClose }) {
 const router = useRouter();

  const handleEditProfile = () => {
    onClose();
    router.push("/profile/edit");
  };

  const handleSettings = () => {
    onClose();
    router.push("/settings");
  };

  const handleLogout = async () => {
    onClose();
    await logout(); 
  };
  return (
    <div className="flex flex-col gap-1 px-3">


      {/* Setting */}
      <button
        onClick={handleSettings}
        className="
          flex items-center gap-3 w-full px-4 py-2.5 rounded-xl
          text-sm font-medium text-gray-700
          hover:bg-gray-50 hover:text-gray-900
          transition-colors duration-150 group
        "
      >
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
          <SettingIcon />
        </span>
        Pengaturan
      </button>

      {/* Divider */}
      <div className="mx-1 my-1 border-t border-gray-100" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-3 w-full px-4 py-2.5 rounded-xl
          text-sm font-medium text-red-500
          hover:bg-red-50 hover:text-red-600
          transition-colors duration-150 group
        "
      >
        <span className="text-red-400 group-hover:text-red-500 transition-colors">
          <LogoutIcon />
        </span>
        Keluar
      </button>
    </div>
  );
}