"use client";
import { useState } from "react";
import { useFolders } from "@/context/FolderContext";
import { createClient } from "@/utils/supabase/client";

export default function CreateFolder({ isOpen, onClose }) {
  const { setFolders } = useFolders();
  const supabase = createClient();

  const [folderName, setFolderName] = useState("");
  const [folderType, setFolderType] = useState("all");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (folderName.trim() === "") {
      return alert("Nama tidak boleh kosong!");
    }

    setLoading(true);

    try {
     
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("folders")
        .insert([
          {
            name: folderName.trim(),
            type: folderType,      
            user_id: user.id,      
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newFolderFromDB = {
        ...data,
        files: [],
      };

      setFolders((prev) => [...prev, newFolderFromDB]);

      setFolderName("");
      setFolderType("all");
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      alert("Gagal menyimpan ke database: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-6">
      <div className="bg-white rounded p-6 w-full max-w-2xl shadow-xl">
        <h2 className="font-bold text-xl mb-4 text-black">Create Folder</h2>

        <input
          type="text"
          placeholder="Folder Name..."
          disabled={loading}
          className="w-full p-4 border-2 rounded-md border-blue-600 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <p className="mb-2 text-[#041C41] font-medium">Select Category</p>

        <div className="mb-8 flex flex-wrap items-center gap-4 text-black">
          {[
            { label: "All", value: "all" },
            { label: "Doc only", value: "doc" },
            { label: "Mp4 / Mp3", value: "media" },
            { label: "Image only", value: "image" },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="folderType"
                value={option.value}
                disabled={loading}
                checked={folderType === option.value}
                onChange={(e) => setFolderType(e.target.value)}
                className="w-4 h-4 appearance-none border border-gray-400 rounded-full checked:bg-blue-600 checked:border-transparent focus:ring-2 focus:ring-blue-300 transition-all cursor-pointer"
              />
              <span className="group-hover:text-blue-600 transition-colors">{option.label}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:bg-blue-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processing...
              </>
            ) : (
              "Create Folder"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}