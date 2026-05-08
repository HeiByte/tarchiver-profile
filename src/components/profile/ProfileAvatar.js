"use client";

export default function ProfileAvatar({ onClick, isOpen }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        className={`
          w-16 h-16 bg-blue-400 rounded-full border-2 border-white shadow-sm
          hover:ring-4 hover:ring-blue-200 hover:ring-offset-1
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-4 focus:ring-blue-300
          ${isOpen ? "ring-4 ring-blue-300 ring-offset-1" : ""}
        `}
        aria-label="Buka profil"
      />
    </div>
  );
}