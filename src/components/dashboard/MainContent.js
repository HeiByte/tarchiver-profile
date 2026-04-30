"use client";
import { useState } from "react";
import CreateFolder from "./CreateFolder";

export default function MainContent() {
  const [folders, setFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (name, type) => {
    if (name.trim() === "") {
      return alert("Nama tidak boleh kosong!");
    }

    const newFolder = {
      id: Date.now(),
      name,
      type,
    };

    setFolders([...folders, newFolder]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-blue-400 overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-black border-4 rounded overflow-hidden">
        {folders.length === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        ) : (
          <FolderGrid items={folders} />
        )}

        <CreateFolder
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="mb-4 font-bold">Folder masih kosong...</p>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-500 text-white border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        Create
      </button>
    </div>
  );
}

function FolderGrid({ items }) {
  return (
    <div className="flex flex-wrap gap-6">
      {items.map((item) => (
        <FolderItem key={item.id} name={item.name} type={item.type} />
      ))}
    </div>
  );
}

function FolderItem({ name }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-12 bg-amber-400 border-4 border-black rounded shadow-md"></div>
      <span className="font-bold text-sm mt-1 text-black">{name}</span>
    </div>
  );
}
