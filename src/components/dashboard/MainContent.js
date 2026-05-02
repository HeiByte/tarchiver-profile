"use client";
import { useState } from "react";
import CreateFolder from "./CreateFolder";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical, Folder } from "lucide-react";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";

export default function MainContent() {
  const { folders, setFolders, showToast } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  const handleSave = (name, type) => {
    if (name.trim() === "") {
      showToast("Nama required!", "error");
      return;
    }

    // Cek duplikasi nama folder 
    const isDuplicate = folders.some((f) => f.name.toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      showToast("Nama alredy taken.", "error");
      return;
    }


    // [INTEGRASI BACKEND]
    // Endpoint: POST /api/folders
    // Payload Data (yg dikirim frontend): { name: "nama folder", type: "tipe folder misal: doc/media/image" } (application/json)
    // Expected Response: Backend harus me-return data object folder (beserta ID aslinya dari Database).
    const newFolder = {
      id: Date.now(), // ⚠️ id ini dibikin sementara di frontend, aslinya nanti direplace pake response backend
      name,
      type,
      files: [], 
    };

    setFolders((prev) => [...prev, newFolder]); 
    showToast("Folder created!", "success");
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (folderToDelete) {
      // [INTEGRASI BACKEND]
      // Endpoint: DELETE /api/folders/${folderToDelete}
      // Payload Data: Kosong (ID diambil dari URL param/dinamis)
      // Expected Response: Status 200 OK (berhasil dihapus di database).
      // Frontend akan membuangnya dari state jika respon dari backend sukses (200).
      setFolders((prev) => prev.filter((f) => f.id !== folderToDelete));
      setFolderToDelete(null);
      showToast("Folder deleted!", "success");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-[#164B99] border-2 rounded overflow-hidden">
        {folders.length === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        ) : (
          <FolderGrid items={folders} onDeleteClick={setFolderToDelete} />
        )}

        <CreateFolder
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        />
        <ConfirmModal
          isOpen={!!folderToDelete}
          onClose={() => setFolderToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Folder"
          message="Delete this folder and all its contents?"
        />
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <button
        onClick={onAdd}
        className="px-6 py-2 bg-[#3B82F6] text-white border-2 rounded-md hover:bg-blue-600"
      >
        Create +
      </button>
    </div>
  );
}

function FolderGrid({ items, onDeleteClick }) {
  return (
    <div className="flex flex-col flex-wrap gap-6">
      {items.map((item) => (
        <FolderItem key={item.id} id={item.id} name={item.name} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  );
}

function FolderItem({ id, name, onDeleteClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    onDeleteClick(id);
  };

  return (
    <Link href={`/dashboard/folder/${id}`}>
      <div 
        className="flex items-center gap-4 cursor-pointer relative max-w-sm hover:bg-gray-50 border-2 border-transparent hover:border-black transition-all p-2 rounded"
        onMouseLeave={() => setMenuOpen(false)}
      >
        <Folder className="w-10 h-10 fill-black" />

        <span className="font-bold text-sm mt-1 text-black flex-1 truncate">
          {name}
        </span>

        <button 
          onClick={handleMenuClick} 
          className="p-2 hover:bg-gray-200 rounded-full border-2 border-transparent hover:border-black"
        >
          <EllipsisVertical className="w-5 h-5 text-black" />
        </button>

        {menuOpen && (
          <div className="absolute -right-30 top-2 bg-white z-10 w-30 rounded overflow-hidden">
            <button 
              onClick={handleDeleteClick} 
              className="w-full px-4 hover:bg-red-100 text-red-600 font-bold border-2  border-black transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}