"use client";
import { useState } from "react";

export default function CreateFolder({ isOpen, onClose, onSubmit }) {
  const [folderName, setFolderName] = useState("");
  const [folderType, setFolderType] = useState("all");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(folderName, folderType);
    setFolderName("");
    setFolderType("all");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-6">
      <div className="bg-white p-6 border-4 border-black w-2xl">
        <h2 className="font-bold text-xl mb-4 text-black">Create Folder</h2>

        {/* Input nama */}
        <input
          type="text"
          placeholder="Name..."
          className="w-full p-2 border-2 border-black mb-4 text-black"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        {/* Intruction */}
        <p className="font-bold mb-2">Select one:</p>
        {/* Radio Group */}
        <div className="mb-8 flex  items-center">
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="folderType"
              value="all"
              checked={folderType === "all"}
              onChange={(e) => setFolderType(e.target.value)}
            />
            All
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="folderType"
              value="doc"
              checked={folderType === "doc"}
              onChange={(e) => setFolderType(e.target.value)}
            />
            Doc only
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="folderType"
              value="media"
              checked={folderType === "media"}
              onChange={(e) => setFolderType(e.target.value)}
            />
            Mp4 / Mp3
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="folderType"
              value="image"
              checked={folderType === "image"}
              onChange={(e) => setFolderType(e.target.value)}
            />
            Image only
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button onClick={onClose} className="px-3 py-1 border-2 border-black">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-500 text-white border-2 border-black"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
