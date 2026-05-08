"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfilePopup from "./ProfilePopup";
import { getUserProfile } from "@/components/auth/auth";

export default function ProfileCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);

  const fetchUser = useCallback(() => {
    getUserProfile().then(setUser);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
      <ProfileAvatar onClick={toggle} isOpen={isOpen} />
      <ProfilePopup
        isOpen={isOpen}
        onClose={close}
        user={user}
        onProfileUpdated={fetchUser}
      />
    </div>
  );
}