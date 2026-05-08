"use client";

import { useState } from "react";
import { updateProfile } from "@/components/auth/auth";
import { ChevronLeft, Check } from "lucide-react";

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
      setError("Gagal menyimpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Username", name: "username", value: user?.username || "", disabled: true },
    { label: "Nama", name: "name", value: form.name, disabled: false },
    { label: "Alamat", name: "address", value: form.address, disabled: false },
    { label: "Email", name: "email", value: form.email, disabled: false },
    { label: "Pekerjaan", name: "job", value: form.job, disabled: false },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">

      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-800 mx-auto">Profil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500
          flex items-center justify-center text-white text-3xl font-bold shadow-md mb-3">
          {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
        </div>
        <p className="text-sm text-gray-400">@{user?.username}</p>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="max-w-md mx-auto flex flex-col gap-0 border border-gray-100 rounded-2xl overflow-hidden bg-gray-50">
          {fields.map((field, i) => (
            <div
              key={field.name}
              className={`flex items-center gap-4 px-4 py-3.5
                ${i !== fields.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <span className="text-xs text-gray-400 w-20 flex-shrink-0">
                {field.label}
              </span>
              {field.disabled ? (
                <span className="text-sm text-gray-500 flex-1 truncate">
                  {field.value || <span className="text-gray-300 italic">—</span>}
                </span>
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  placeholder="Belum diisi"
                  className="flex-1 text-sm text-gray-800 bg-transparent border-0
                    focus:outline-none placeholder:text-gray-300 min-w-0"
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-3 text-center max-w-md mx-auto">{error}</p>
        )}
      </div>

      {/* Footer: Back kiri, Simpan kanan */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600
            transition-colors duration-150"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-lg
            text-sm font-medium text-white
            bg-indigo-500 hover:bg-indigo-600
            disabled:opacity-50 transition-colors duration-150"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Simpan
        </button>
      </div>
    </div>
  );
}