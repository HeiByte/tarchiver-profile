"use client";

import { Search, Menu } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ProfileCard from "../profile/ProfileCard";

export default function NavDash({ setMobileOpen }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center mb-4 shadow-md bg-white px-4 py-2 sticky top-0 z-[60]">
      {/* LEFT SIDE */}
      <div className="flex item-center gap-3 w-full">
        {/* Button Mobile */}

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden bg-[#1E293B] text-white p-2 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-black" />
          </div>
          <input
            type="text"
            placeholder="Search files..."
            className="block w-full pl-10 pr-4 py-1 bg-white text-[#5D78A4] placeholder-[#5D78A4]/60 rounded-lg border border-blue-400 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("query")?.toString()}
          />
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2">
        <ProfileCard />
      </div>
    </div>
  );
}