"use client";
import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import CreateFolder from "@/components/dashboard/CreateFolder";
import { FolderProvider } from "@/context/FolderContext";
import NavDash from "@/components/dashboard/NavDash";

export default function DashboardLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isBackupsRoute = pathname === "/dashboard/backups";

  return (
    <FolderProvider>
      <div className="flex h-screen overflow-hidden">

        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onCreateClick={() => setIsModalOpen(true)}
        />

        <main className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden bg-white">
          {!isBackupsRoute && <NavDash setMobileOpen={setMobileOpen} />}
          <div className="flex-1 min-h-0 overflow-auto">
            <Suspense fallback={<div>Loading search...</div>}>
              <div className="h-full">
                {children}
              </div>
            </Suspense>
          </div>
        </main>

        <CreateFolder
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </FolderProvider>
  );
}