"use client";
import { useRef, useState, useOptimistic, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical, FileText, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";
import ConfirmModal from "./ConfirmModal";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";


function broadcastStorageUpdate() {
  try {
  
    window.dispatchEvent(new Event("storage_update"));

    const channel = new BroadcastChannel("storage_update");
    channel.postMessage("refresh");
    channel.close();
  } catch (_) {}
}

const uploadSchema = z.object({
  fileSize: z.number().max(50 * 1024 * 1024, "File size exceeds 50MB limit."),
  fileName: z.string().min(1, "File name cannot be empty."),
});

export default function FolderContent({ folderId }) {
  const { folders, setFolders, isLoading, showToast } = useFolders();
  const fileInputRef = useRef(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const folder = folders.find((f) => f.id.toString() === folderId);

  // ─── useOptimistic UI ────────
  const [optimisticFiles, setOptimisticFiles] = useOptimistic(
    folder?.files ?? [],
    (currentFiles, deletedId) => currentFiles.filter((f) => f.id !== deletedId),
  );

  const [isPending, startTransition] = useTransition();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-8 bg-white m-8 border-[#164B99] border-2 rounded overflow-hidden flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-8 bg-white m-8 border-blue-500 border-2 rounded overflow-hidden flex flex-col items-center justify-center">
          <p className="font-bold text-lg text-black mb-4">Folder Not Found.</p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-blue-500 text-white border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  let acceptStr = "*";
  if (folder.type === "doc")
    acceptStr =
      ".doc,.docx,.pdf,.txt,application/pdf,application/msword,text/plain";
  else if (folder.type === "media")
    acceptStr = "video/mp4,audio/mpeg,audio/mp3,.mp4,.mp3";
  else if (folder.type === "image") acceptStr = "image/*";

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    const zodResult = uploadSchema.safeParse({
      fileSize: file.size,
      fileName: file.name,
    });

    if (!zodResult.success) {
      showToast(zodResult.error.errors[0]?.message || "Invalid file.", "error");
      e.target.value = "";
      return;
    }

    let isValid = true;
    if (
      folder.type === "doc" &&
      !file.name.match(/\.(doc|docx|pdf|txt)$/i) &&
      !file.type.match(/(pdf|msword|text)/i)
    )
      isValid = false;
    else if (
      folder.type === "media" &&
      !file.name.match(/\.(mp3|mp4)$/i) &&
      !file.type.match(/(video|audio)/i)
    )
      isValid = false;
    else if (folder.type === "image" && !file.type.match(/image/i))
      isValid = false;

    if (!isValid) {
      const msgs = {
        doc: "This folder only accepts Documents (PDF, DOCX, TXT).",
        media: "This folder only accepts Media (MP4, MP3).",
        image: "This folder only accepts Images (PNG, JPG, etc).",
      };
      showToast(
        msgs[folder.type] || "Upload failed: File type mismatch.",
        "error",
      );
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", folder.id.toString());
      formData.append("folderName", folder.name || "");
      formData.append("folderType", folder.type || "");
      formData.append("fileCount", (folder.files?.length || 0).toString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 413) {
          showToast(result.error || "Storage quota exceeded (max 250MB).", "error");
        } else {
          showToast(result.error || "Upload failed.", "error");
        }
        e.target.value = "";
        return;
      }

      setFolders((prev) =>
        prev.map((f) =>
          f.id === folder.id
            ? { ...f, files: [...(f.files || []), result.file] }
            : f,
        ),
      );

     
      broadcastStorageUpdate();

      showToast("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      showToast(error.message || "An error occurred during upload", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ─── Delete via backend ─────────
  const handleDeleteConfirm = () => {
    if (!fileToDelete?.id) {
      showToast("Failed: Invalid File ID", "error");
      return;
    }

    const targetFile = fileToDelete;
    setFileToDelete(null);

    startTransition(async () => {
      // Optimistic
      setOptimisticFiles(targetFile.id);

      try {
        const response = await fetch(`/api/files/${targetFile.id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Delete failed");
        }

  
        setFolders((prev) =>
          prev.map((f) =>
            f.id === targetFile.folder_id
              ? {
                  ...f,
                  files: f.files.filter((file) => file.id !== targetFile.id),
                }
              : f,
          ),
        );

      
        broadcastStorageUpdate();

        showToast("File deleted permanently", "success");
      } catch (error) {
        console.error("Detail Error:", error);
        showToast("Delete failed: " + error.message, "error");
      }
    });
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(`/api/files/${file.id}/download`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Download failed");

     
      const a = document.createElement("a");
      a.href = result.url;
      a.download = file.original_name || file.name;
      a.click();
    } catch (error) {
      showToast("Download failed: " + error.message, "error");
    }
  };

  const filteredFiles = optimisticFiles.filter((file) =>
    (file.original_name || file.name)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-x-hidden">
      <div className="flex-1 p-3 md:p-8  bg-white m-2 md:m-8 border-[#164B99] border-2 rounded overflow-hidden">
        <input
          type="file"
          id="global-file-upload"
          ref={fileInputRef}
          className="hidden"
          accept={acceptStr}
          onChange={handleFileChange}
        />

        {uploading && <UploadingSkeleton />}

        {!uploading && filteredFiles.length === 0 ? (
          <EmptyStateFile onUpload={handleUploadClick} />
        ) : (
          !uploading && (
            <FileGrid
              items={filteredFiles}
              onDeleteClick={setFileToDelete}
              onDownloadClick={handleDownload}
            />
          )
        )}

        <ConfirmModal
          isOpen={!!fileToDelete}
          onClose={() => setFileToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete File"
          confirmText="Delete"
          message={`Delete "${fileToDelete?.original_name || fileToDelete?.name}"?`}
        />
      </div>
    </div>
  );
}

function UploadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex items-center gap-4 max-w-xl p-2">
        <Skeleton className="w-16 h-12 rounded-md flex-shrink-0" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/4 rounded-md" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}

const EmptyStateFile = forwardRef(({ onUpload }, ref) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex flex-col items-center justify-center border-2 border-blue-500 m-4 md:m-20 text-center p-8 md:p-16 border-dashed w-full max-w-md">
      <button
        onClick={onUpload}
        className="flex items-center justify-center px-4 mb-4 py-2 text-center"
      >
        <Upload className="bg-[#3B82F6] text-white p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 rounded-md hover:bg-blue-400 active:shadow-none active:translate-y-1 transition-all" />
      </button>
      <p className="text-lg md:text-2xl text-black">Upload Files</p>
    </div>
  </div>
));
EmptyStateFile.displayName = "EmptyStateFile";

const FileGrid = forwardRef(({ items, onDeleteClick, onDownloadClick }, ref) => (
  <div className="flex flex-col gap-6 mt-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <FileItem
          key={item.id}
          file={item}
          onDeleteClick={onDeleteClick}
          onDownloadClick={onDownloadClick}
        />
      ))}
    </div>
  </div>
));
FileGrid.displayName = "FileGrid";

function FileItem({ file, onDeleteClick, onDownloadClick }) {
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
    onDeleteClick(file);
  };

  const handleDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    onDownloadClick(file);
  };

  return (
    <div
      className="flex items-center gap-3 cursor-pointer w-full p-3 hover:bg-blue-50 border-2 border-transparent hover:border-blue-600 rounded transition-all relative"
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <FileText className="w-8 h-10 md:w-10 md:h-10 text-white fill-blue-600" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-bold text-xs text-black truncate">
          {file.name}
        </span>
      </div>
      <button
        onClick={handleMenuClick}
        className="p-2 hover:bg-blue-100 rounded-full border-2 border-transparent hover:border-blue-600"
      >
        <EllipsisVertical className="w-5 h-5 text-black" />
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-12 bg-white z-10 w-24 rounded overflow-hidden shadow-lg border">
          <button
            onClick={handleDownloadClick}
            className="w-full px-4 hover:bg-blue-100 text-blue-600 text-sm md:text-base font-bold border-1 border-blue-600 transition-all"
          >
            Download
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-full px-4 hover:bg-red-100 text-red-600 text-xs font-bold border-1 border-blue-600 transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}