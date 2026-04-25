'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "../ui/MobileMenu";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
  { name: "Experiment", path: "/experiment" },
];

export default function Navbar() {
  const pathname = usePathname();

 return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Nama Aplikasi / Logo */}
        <div className="text-xl font-bold text-white">
          Tarchiver
        </div>

        {/* Desktop Menu: (768px) ke atas */}
        <div className="text-background hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${isActive 
                    ? "bg-amber-100 text-amber-700" 
                    : "text-white hover:bg-slate-50 hover:text-amber-600"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu */}
        <MobileMenu links={links} pathname={pathname} />
      </div>
    </nav>
  );
}
