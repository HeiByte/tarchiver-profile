"use client";
import { useRef, useState, useOptimistic, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical, FileText, Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { forwardRef } from "react";
import ConfirmModal from "./ConfirmModal";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";

const supabase = createClient();

const uploadSchema = z.object({
  fileSize: z.number().max(50 * 1024 * 1024, "File size exceeds 50MB limit."),
  fileName: z.string().min(1, "File name cannot be empty."),
});

export default function FolderContent({ folderId }) {
  const { folders, setFolders, showToast } = useFolders();
  const fileInputRef = useRef(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const folder = folders.find((f) => f.id.toString() === folderId);

  // ─── useOptimistic ui────────
  const [optimisticFiles, setOptimisticFiles] = useOptimistic(
    folder?.files ?? [],
    (currentFiles, deletedId) => currentFiles.filter((f) => f.id !== deletedId),
  );

  const [isPending, startTransition] = useTransition();

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileSequence = String(folder.files.length + 1).padStart(2, "0");
      const extMatch = file.name.match(/\.([^.]+)$/);
      const ext = extMatch ? extMatch[1] : "";
      const folderStr = (folder.name || "UNKNOWN")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_");
      const d = new Date();
      const tglStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const generatedName = `${fileSequence}_${folderStr}_${tglStr}${ext ? "." + ext : ""}`;
      const storagePath = `${user.id}/${folder.id}/${generatedName}`;

      const { error: storageError } = await supabase.storage
        .from("tarchive-bucket")
        .upload(storagePath, file, { upsert: true });

      if (storageError) throw storageError;

      const { data: dbData, error: dbError } = await supabase
        .from("files")
        .insert([
          {
            name: generatedName,
            original_name: file.name,
            extension: ext,
            mime_type: file.type,
            folder_id: folder.id,
            user_id: user.id,
            storage_path: storagePath,
            size: file.size,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setFolders((prev) =>
        prev.map((f) =>
          f.id === folder.id
            ? { ...f, files: [...(f.files || []), dbData] }
            : f,
        ),
      );

      showToast("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      showToast(error.message || "An error occurred during upload", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ─── Hapus file dengan Optimistic UI ─────
  const handleDeleteConfirm = () => {
    if (!fileToDelete?.id) {
      showToast("Failed: Invalid File ID", "error");
      return;
    }

    const targetFile = fileToDelete;
    setFileToDelete(null); // tutup modal segera

    startTransition(async () => {
      setOptimisticFiles(targetFile.id);

      try {
        // Hapus dari Storage
        if (targetFile.storage_path) {
          const { error: storageError } = await supabase.storage
            .from("tarchive-bucket")
            .remove([targetFile.storage_path]);

          if (storageError) throw storageError;
        }

        // Hapus dari Database
        const { error: dbError } = await supabase
          .from("files")
          .delete()
          .eq("id", targetFile.id);

        if (dbError) throw dbError;

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

        showToast("File deleted permanently", "success");
      } catch (error) {
        console.error("Detail Error:", error);
        showToast("Delete failed: " + error.message, "error");
      }
    });
  };

  // Filter files untuk search
  const filteredFiles = optimisticFiles.filter((file) =>
    (file.original_name || file.name)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-[#164B99] border-2 rounded overflow-hidden">
        <input
          type="file"
          id="global-file-upload"
          ref={fileInputRef}
          className="hidden"
          accept={acceptStr}
          onChange={handleFileChange}
        />

        {/* Upload loading skeleton */}
        {uploading && <UploadingSkeleton />}

        {!uploading && filteredFiles.length === 0 ? (
          <EmptyStateFile onUpload={handleUploadClick} />
        ) : (
          !uploading && (
            <FileGrid items={filteredFiles} onDeleteClick={setFileToDelete} />
          )
        )}

        <ConfirmModal
          isOpen={!!fileToDelete}
          onClose={() => setFileToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete File"
          message={`Delete "${fileToDelete?.original_name || fileToDelete?.name}"?`}
        />
      </div>
    </div>
  );
}

// ─── Skeleton saat upload sedang berlangsung ─────
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
    <div className="flex flex-col items-center justify-center border-2 border-blue-500 m-40 text-center p-20 border-dashed">
      <button
        onClick={onUpload}
        className="flex items-center justify-center px-4 mb-4 py-2 text-center"
      >
        <Upload className="bg-[#3B82F6] p-4 w-16 h-16 rounded-md hover:bg-blue-400 active:shadow-none active:translate-y-1 transition-all" />
      </button>
      <p className="text-2xl text-black">Upload Files</p>
    </div>
  </div>
));
EmptyStateFile.displayName = "EmptyStateFile";

const FileGrid = forwardRef(({ items, onDeleteClick }, ref) => (
  <div className="flex flex-col gap-6 mt-4">
    <div className="flex flex-col flex-wrap gap-6">
      {items.map((item) => (
        <FileItem key={item.id} file={item} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  </div>
));
FileGrid.displayName = "FileGrid";

function FileItem({ file, onDeleteClick }) {
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

  return (
    <div
      className="flex items-center gap-4 cursor-pointer w-full max-w-xl p-2 hover:bg-blue-50 border-2 border-transparent hover:border-black rounded transition-all relative"
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="w-16 h-12 flex items-center justify-center">
        <FileText className="w-12 h-12 text-white fill-blue-600" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-bold text-sm text-black truncate">
          {file.name}
        </span>
      </div>
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
            className="w-full px-4 hover:bg-red-100 text-red-600 font-bold border-2 border-black transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
