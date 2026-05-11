"use client";
import { useState } from "react";
import { useFolders } from "@/context/FolderContext";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";

const folderSchema = z.object({
  folderName: z
    .string()
    .min(1, "Name is required!")
    .max(50, "Folder name must be 50 characters or less.")
    .regex(/^[a-zA-Z0-9 _-]+$/, "Folder name contains invalid characters."),
  folderType: z.enum(["all", "doc", "media", "image"]),
});

export default function CreateFolder({ isOpen, onClose }) {
  const { setFolders } = useFolders();
  const supabase = createClient();

  const [folderName, setFolderName] = useState("");
  const [folderType, setFolderType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setErrors({});

    const result = folderSchema.safeParse({ folderName, folderType });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
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
            name: result.data.folderName.trim(),
            type: result.data.folderType,      
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
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      setErrors({ general: [error.message] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-6 z-[10000]">
      <div className="bg-white rounded p-6 w-full max-w-2xl shadow-xl">
        <h2 className="font-bold text-xl mb-4 text-black">Create Folder</h2>

        <input
          type="text"
          placeholder="Folder Name..."
          disabled={loading}
          className={`w-full p-4 border-2 rounded-md mb-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${errors.folderName ? "border-red-500" : "border-blue-600"}`}
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            if (errors.folderName) setErrors((prev) => ({ ...prev, folderName: undefined }));
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {errors.folderName ? (
          <p className="text-red-500 text-xs mb-3">{errors.folderName[0]}</p>
        ) : (
          <div className="mb-4" />
        )}

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

        {errors.general && (
          <p className="text-red-500 text-xs mb-2">{errors.general[0]}</p>
        )}

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
