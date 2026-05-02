"use client";
import { useState } from "react";
import { useFolders } from "@/context/FolderContext";

export default function CreateFolder({ isOpen, onClose }) {
  const { setFolders } = useFolders();

  const [folderName, setFolderName] = useState("");
  const [folderType, setFolderType] = useState("all");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (folderName.trim() === "") {
      return alert("Nama tidak boleh kosong!");
    }

    const newFolder = {
      id: Date.now(),
      name: folderName,
      type: folderType,
      files: [],
    };

    setFolders((prev) => [...prev, newFolder]);

    setFolderName("");
    setFolderType("all");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-6">
      <div className="bg-white rounded p-6 w-2xl">
        <h2 className="font-bold text-xl mb-4 text-black">Create Folder</h2>

        <input
          type="text"
          placeholder="Name..."
          className="w-full p-4 border-2 rounded-md border-blue-600 mb-4 text-black"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <p className="mb-2 text-[#041C41]">Select one</p>

        <div className="mb-8 flex items-center gap-4 text-black cursor-pointer">
          <label className="flex items-center gap-2 ">
            <input
              type="radio"
              name="folderType"
              value="all"
              checked={folderType === "all"}
              onChange={(e) => setFolderType(e.target.value)}
              className="w-3 h-3 appearance-none border-1 border-black rounded-full checked:bg-red-600  checked:border-red-700 focus:ring-2 focus:ring-red-400 transition-all cursor-pointer"
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
              className="w-3 h-3 appearance-none border-1 border-black rounded-full checked:bg-red-600  checked:border-red-700 focus:ring-2 focus:ring-red-400 transition-all cursor-pointer"
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
              className="w-3 h-3 appearance-none border-1 border-black rounded-full checked:bg-red-600  checked:border-red-700 focus:ring-2 focus:ring-red-400 transition-all cursor-pointer"
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
              className="w-3 h-3 appearance-none border-1 border-black rounded-full checked:bg-red-600  checked:border-red-700 focus:ring-2 focus:ring-red-400 transition-all cursor-pointer"
            />
            Image only
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button onClick={onClose} className="px-3 py-1 text-red-600 hover:text-red-400">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-500 text-white border-2 rounded-md hover:bg-blue-400"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
