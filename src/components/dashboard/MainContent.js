"use client";
import { Suspense, useState, useEffect, useOptimistic, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import CreateFolder from "./CreateFolder";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical, Folder } from "lucide-react";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import { Skeleton } from "@/components/ui/skeleton";

function MainContentInner() {
  const { folders, setFolders, isLoading, setIsLoading, showToast } = useFolders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [optimisticFolders, setOptimisticFolders] = useOptimistic(
    folders,
    (currentFolders, deletedId) => currentFolders.filter((f) => f.id !== deletedId),
  );

  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

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
      const { data: { user } } = await supabase.auth.getUser();
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

  const handleDeleteConfirm = () => {
    if (!folderToDelete) return;

    const idToDelete = folderToDelete;
    setFolderToDelete(null);

    startTransition(async () => {
      setOptimisticFolders(idToDelete);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const targetFolder = folders.find((f) => f.id === idToDelete);

        if (targetFolder?.files?.length > 0) {
          const storagePaths = targetFolder.files.map((f) => f.storage_path).filter(Boolean);

          if (storagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
              .from("tarchive-bucket")
              .remove(storagePaths);

            if (storageError) {
              console.warn("Storage delete warning:", storageError.message);
            }
          }
        }

        const { error } = await supabase.from("folders").delete().eq("id", idToDelete);

        if (error) throw error;

        setFolders((prev) => prev.filter((f) => f.id !== idToDelete));
        showToast("Folder deleted!", "success");
      } catch (error) {
        showToast("Delete failed: " + error.message, "error");
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-x-hidden">
      <div className="flex-1 min-h-0 p-3 md:p-6 bg-white m-2 md:m-6 border-[#164B99] border-2 rounded overflow-y-auto relative">
        {isLoading ? (
          <FolderGridSkeleton />
        ) : optimisticFolders.length === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        ) : (
          <FolderGrid items={optimisticFolders} onDeleteClick={setFolderToDelete} />
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
          confirmText="Delete"
          title="Delete Folder"
          message="Delete this folder and all its contents?"
        />
      </div>
    </div>
  );
}

export default function MainContent() {
  return (
    <Suspense fallback={null}>
      <MainContentInner />
    </Suspense>
  );
}

function FolderGridSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 w-full p-2">
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
        className="px-5 md:px-6 py-2 text-sm md:text-base bg-[#3B82F6] text-white border-2 rounded-md hover:bg-blue-600"
      >
        Create +
      </button>
    </div>
  );
}

function FolderGrid({ items, onDeleteClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-6">
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
    setMenuOpen((prev) => !prev);
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
        className="flex items-center gap-3 cursor-pointer relative w-full min-h-[70px] hover:bg-gray-50 border-2 border-transparent hover:border-black transition-all p-3 rounded"
        onMouseLeave={() => setMenuOpen(false)}
      >
        <Folder className="w-6 h-6 md:w-8 md:h-8 fill-black flex-shrink-0" />
        <span className="font-bold text-sm md:text-base text-black flex-1 truncate break-all">
          {name}
        </span>
        <button
          onClick={handleMenuClick}
          className="p-2 hover:bg-gray-200 rounded-full border-2 border-transparent hover:border-black flex-shrink-0"
        >
          <EllipsisVertical className="w-5 h-5 text-black" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-0 bg-white z-20 w-28 rounded overflow-hidden shadow-lg border">
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2 hover:bg-red-100 text-sm text-red-600 font-bold border-2 border-black transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}