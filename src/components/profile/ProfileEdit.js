"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/auth";
import {
  ChevronLeft,
  Check,
  User,
  MapPin,
  Mail,
  Briefcase,
} from "lucide-react";

export default function ProfileEdit({ user, onBack, onSaved }) {
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
    },
    {
      label: "Contact",
      name: "contact",
      value: form.email,
      disabled: false,
      icon: <Mail size={20} />,
    },
    {
      label: "Address",
      name: "address",
      value: form.address,
      disabled: false,
      icon: <MapPin size={20} />,
    },
    {
      label: "Job",
      name: "job",
      value: form.job,
      disabled: false,
      icon: <Briefcase size={20} />,
    },
  ];

  const displayName = (user?.name || user?.username || "User").toUpperCase();

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FBFCFD] flex flex-col items-center justify-center p-6">
      {/* Card */}
      <div className="w-full max-w-2xl bg-[#F8FAFC] rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-500
            flex items-center justify-center text-white text-3xl shadow-md
            border-4 border-blue-400 overflow-hidden"
          >
            {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Username */}
        <h1 className="text-2xl font-semibold tracking-widest text-gray-800 -mt-2">
          {displayName}
        </h1>

        {/* Fields */}
        <div className="w-full flex flex-col gap-5 mt-2">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <span className="text-xs text-black ml-10">{field.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-black flex-shrink-0">
                  {field.icon}
                </span>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  disabled={field.disabled}
                  placeholder="Not Set"
                  className="flex-1 text-sm text-gray-700 bg-transparent border-0 border-b border-gray-300
                    focus:outline-none focus:border-blue-400 pb-1
                    placeholder:text-gray-300 disabled:text-gray-400 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between mt-6 p-5 absolute bottom-0">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            text-sm font-medium text-blue-500 border border-blue-300
            hover:bg-blue-50 transition-colors duration-150"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {/* Save */}
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
  );
}
