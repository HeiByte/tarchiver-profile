"use client";

import { useState, useRef, useEffect } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfilePopup from "./ProfilePopup";


const mockUser = {
  name: "Budi Santoso",
  email: "budi@email.com",
};

export default function ProfileCard() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

 
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Profil Avatar (trigger) */}
      <div className="flex items-center gap-3">
        <ProfileAvatar onClick={toggle} isOpen={isOpen} />
      </div>

      {/* Popup */}
      <ProfilePopup isOpen={isOpen} onClose={close} user={mockUser} />
    </div>
  );
}