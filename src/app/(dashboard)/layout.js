"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CreateFolder from "@/components/dashboard/CreateFolder";
import { FolderProvider } from "@/context/FolderContext";

export default function DashboardLayout({ children }) {
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

    setFolders((prev) => [...prev, newFolder]);
    setIsModalOpen(false);
  };

  return (
    <FolderProvider value={{ folders, setFolders }}>
      <div className="flex min-h-screen">
        <Sidebar onCreateClick={() => setIsModalOpen(true)} />

        <main className="flex-1 bg-white relative">
          {children}
        </main>

        <CreateFolder
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        />
      </div>
    </FolderProvider>
  );
}