"use client";
import { useParams } from "next/navigation";
import { useFolders } from "@/context/FolderContext";
import Header from "@/components/dashboard/Header";
import FolderContent from "@/components/dashboard/FolderContent";

export default function FolderPage() {
  const params = useParams();
  const folderId = params?.id;
  const { folders } = useFolders();

  const folder = folders.find((f) => f.id.toString() === folderId);
  
  // Use the folder name for header, fallback to general if not found yet
  const title = folder ? `Folder: ${folder.name}` : "Folder Not Found";

  return (
    <div className="flex flex-col bg-white h-screen">
      <Header title={title} />
      {folderId && <FolderContent folderId={folderId} />}
    </div>
  );
}
