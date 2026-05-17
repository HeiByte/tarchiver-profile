"use client";
import { useState, Suspense } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import CreateFolder from "@/components/dashboard/CreateFolder";
import { FolderProvider } from "@/context/FolderContext";
import NavDash from "@/components/dashboard/NavDash";

export default function DashboardLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //STATE SIDEBAR MOBILE
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <FolderProvider>
      <div className="flex min-h-screen">

          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onCreateClick={() => setIsModalOpen(true)}/>

        <main className="flex-1 bg-white relative">
          <NavDash setMobileOpen={setMobileOpen}></NavDash>
          <Suspense fallback={<div>Loading search...</div>}>
            {children}
          </Suspense>
        </main>

        <CreateFolder
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </FolderProvider>
  );
}