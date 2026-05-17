"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { updateProfile } from "@/components/auth/auth";
import {
  ChevronLeft,
  Check,
  User,
  MapPin,
  Mail,
  Briefcase,
} from "lucide-react";

function ProfileEditContent({ user, onBack, onSaved }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
    email: user?.email || "",
    job: user?.job || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await updateProfile(form);
      onSaved();
    } catch (err) {
      setError("Save Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Name",
      name: "name",
      value: form.name,
      disabled: false,
      icon: <User size={20} />,
      placeholder: "Not Set",
    },
    {
      label: "Contact (Email)",
      name: "email",
      value: form.email,
      disabled: true,
      icon: <Mail size={20} />,
      placeholder: "Not Set",
      hint: "Email cannot be changed here",
    },
    {
      label: "Address",
      name: "address",
      value: form.address,
      disabled: false,
      icon: <MapPin size={20} />,
      placeholder: "Not Set",
    },
    {
      label: "Job",
      name: "job",
      value: form.job,
      disabled: false,
      icon: <Briefcase size={20} />,
      placeholder: "Not Set",
    },
  ];

  const displayName = (user?.name || user?.username || "User").toUpperCase();

  return (
    <div className="fixed inset-0 z-[999999] bg-[#FBFCFD] flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Card */}
      <div className="w-full max-w-2xl bg-[#F8FAFC] rounded-3xl shadow-2xl px-6 sm:px-12 py-8 sm:py-10 flex flex-col items-center gap-6 my-auto">
        {/* Avatar */}
        <div className="relative">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-500
            flex items-center justify-center text-white text-2xl sm:text-3xl shadow-md
            border-4 border-blue-400 overflow-hidden"
          >
            {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Username */}
        <h1 className="text-xl sm:text-2xl font-semibold tracking-widest text-gray-800 -mt-2 text-center">
          {displayName}
        </h1>

        {/* Fields */}
        <div className="w-full flex flex-col gap-5 mt-2">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between ml-8 sm:ml-10">
                <span className="text-xs text-black">{field.label}</span>
                {field.hint && (
                  <span className="text-[10px] text-gray-400 italic">
                    {field.hint}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 ${field.disabled ? "text-gray-300" : "text-black"}`}
                >
                  {field.icon}
                </span>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  className={`flex-1 text-sm bg-transparent border-0 border-b pb-1
                    focus:outline-none transition-colors
                    placeholder:text-gray-300
                    ${
                      field.disabled
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 focus:border-blue-400"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <div className="w-full flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              text-sm font-medium text-blue-500 border border-blue-300
              hover:bg-blue-50 transition-colors duration-150"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl
              text-sm font-medium text-white
              bg-blue-500 hover:bg-blue-600
              disabled:opacity-50 transition-colors duration-150"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileEdit({ user, onBack, onSaved }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(
    <ProfileEditContent user={user} onBack={onBack} onSaved={onSaved} />,
    document.body
  );
}