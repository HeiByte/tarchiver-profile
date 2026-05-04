import { Search } from "lucide-react";
export default function NavDash() {
  return (
    <div className="flex justify-between items-center mb-8 shadow-md bg-white p-6 sticky">
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
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-blue-400 rounded-full border-2 border-white shadow-sm"></div>
      </div>
    </div>
  );
}
