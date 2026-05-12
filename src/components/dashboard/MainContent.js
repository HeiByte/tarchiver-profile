"use client";
import { useState, useEffect, useOptimistic, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import CreateFolder from "./CreateFolder";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical, Folder } from "lucide-react";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainContent() {
  const { folders, setFolders, isLoading, setIsLoading, showToast } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // ─── useOptimistic UI───
  const [optimisticFolders, setOptimisticFolders] = useOptimistic(
    folders,
    (currentFolders, deletedId) =>
      currentFolders.filter((f) => f.id !== deletedId),
  );

  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true); 
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        let supabaseQuery = supabase
          .from("folders")
          .select("*, files!files_folder_id_fkey(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (query) {
          supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
        }

        const { data, error } = await supabaseQuery;
        if (error) throw error;

        const foldersWithFiles = (data || []).map((f) => ({
          ...f,
          files: f.files || [],
        }));

        setFolders(foldersWithFiles);
      } catch (error) {
        showToast("Failed to load folder: " + error.message, "error");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchFolders();
  }, [query]);

  const handleSave = async (name, type) => {
    if (name.trim() === "") {
      showToast("Name required!", "error");
      return;
    }

    const isDuplicate = folders.some(
      (f) => f.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (isDuplicate) {
      showToast("Name already taken.", "error");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("folders")
        .insert([{ name: name.trim(), type, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setFolders((prev) => [...prev, { ...data, files: [] }]);
      showToast("Folder created!", "success");
      setIsModalOpen(false);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // ─── Hapus folder dengan Optimistic UI ───────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!folderToDelete) return;

    const idToDelete = folderToDelete;
    setFolderToDelete(null);

    startTransition(async () => {
      setOptimisticFolders(idToDelete);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const targetFolder = folders.find((f) => f.id === idToDelete);

        if (targetFolder?.files?.length > 0) {
          const storagePaths = targetFolder.files
            .map((f) => f.storage_path)
            .filter(Boolean);

          if (storagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
              .from("tarchive-bucket")
              .remove(storagePaths);

            if (storageError) {
              console.warn("Storage delete warning:", storageError.message);
            }
          }
        }

        const { error } = await supabase
          .from("folders")
          .delete()
          .eq("id", idToDelete);

        if (error) throw error;

        setFolders((prev) => prev.filter((f) => f.id !== idToDelete));
        showToast("Folder deleted!", "success");
      } catch (error) {
        showToast("Delete failed: " + error.message, "error");
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-[#164B99] border-2 rounded overflow-hidden relative">
        {isLoading ? (
          <FolderGridSkeleton />
        ) : optimisticFolders.length === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        ) : (
          <FolderGrid
            items={optimisticFolders}
            onDeleteClick={setFolderToDelete}
          />
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

function FolderGridSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 max-w-sm p-2">
          <Skeleton className="w-10 h-10 rounded-md flex-shrink-0" />
          <Skeleton className="h-4 flex-1 rounded-md" />
          <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
        </div>
      ))}
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
    <div className="flex flex-col flex-wrap gap-6 overflow-y-auto">
      {items.map((item) => (
        <FolderItem
          key={item.id}
          id={item.id}
          name={item.name}
          onDeleteClick={onDeleteClick}
        />
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
          <div className="absolute right-[-7.5rem] top-2 bg-white z-10 w-[7.5rem] rounded overflow-hidden">
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 hover:bg-red-100 text-red-600 font-bold border-2 border-black transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}