"use client"; 

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ links, pathname }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
     {/* ===HAMBURGER MENU=== */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            // Icon X (Close)
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            // Icon Hamburger
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* ===Dropdown Menu==== */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 bg-white border-b border-slate-200 p-4 flex flex-col gap-2 shadow-lg z-40">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)} 
              className={`px-4 py-3 rounded-md text-base font-medium ${
                pathname === link.path ? "bg-amber-100 text-amber-700" : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}