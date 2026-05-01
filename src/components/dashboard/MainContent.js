"use client";
import { useState } from "react";
import CreateFolder from "./CreateFolder";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";

export default function MainContent() {
  const { folders, setFolders, showToast } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  const handleSave = (name, type) => {
    if (name.trim() === "") {
      showToast("Nama folder tidak boleh kosong!", "error");
      return;
    }

    // Cek duplikasi nama folder (case-insensitive)
    const isDuplicate = folders.some((f) => f.name.toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      showToast("Nama folder sudah digunakan! Silakan gunakan nama lain.", "error");
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
    showToast("Folder berhasil dibuat!", "success");
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
      showToast("Folder berhasil dihapus!", "success");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-400 overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-black border-4 rounded overflow-hidden">
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
          title="Hapus Folder"
          message="Apakah Anda setuju menghapus folder ini beserta seluruh isinya?"
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
        <div className="w-16 h-12 bg-amber-400 border-4 border-black rounded shadow-md"></div>

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
          <div className="absolute right-12 top-10 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 w-32 rounded overflow-hidden">
            <button 
              onClick={handleDeleteClick} 
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-bold border-b-2 border-transparent hover:border-black transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}