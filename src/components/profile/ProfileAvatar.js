"use client";

export default function ProfileAvatar({ onClick, isOpen, initial = "U" }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-10 h-10 rounded-full overflow-hidden
        bg-gradient-to-br from-indigo-400 to-violet-500
        border-2 transition-all duration-200 cursor-pointer
        focus:outline-none
        ${isOpen
          ? "border-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.25)]"
          : "border-white/80 hover:border-indigo-300 hover:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
        }
      `}
      aria-label="Buka profil"
    >
      <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold select-none">
        {initial}
      </span>
    </button>
  );
}