"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useFolders } from "@/context/FolderContext";
import {
  DatabaseBackup,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  HardDrive,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmModal from "./ConfirmModal";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";

  const d = new Date(dateStr);

  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBackupName(dateStr) {
  if (!dateStr) return "Backup";

  const d = new Date(dateStr);

  return `Backup — ${d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function StatusBadge({ status }) {
  const map = {
    completed: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Ready",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },

    processing: {
      icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
      label: "Creating Backup",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    },

    failed: {
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "Backup Failed",
      className: "bg-red-50 text-red-700 border border-red-200",
    },
  };

  const config = map[status] || map.processing;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function BackupSkeletonItem() {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
      <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />

      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>

      <Skeleton className="w-24 h-8 rounded-md flex-shrink-0" />
    </div>
  );
}

function BackupItem({ backup, onRestore, onDelete, isRestoring }) {
  return (
    <div className="group flex items-start gap-3 p-3 border border-gray-100 hover:border-[#164B99] rounded-lg transition-all bg-white hover:bg-blue-50/30">
      {/* Icon */}
      <div className="w-8 h-8 flex-shrink-0 bg-[#EFF6FF] rounded-md flex items-center justify-center mt-0.5">
        <HardDrive className="w-4 h-4 text-[#164B99]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-black truncate">
          {formatBackupName(backup.created_at)}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[10px] text-gray-400">
            {formatDate(backup.created_at)}
          </span>

          {backup.size > 0 && (
            <span className="text-[10px] text-gray-400">
              · {formatBytes(backup.size)}
            </span>
          )}

          <StatusBadge status={backup.status} />
        </div>
      </div>

      {/* Actions */}
      {backup.status === "completed" && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onRestore(backup)}
            disabled={isRestoring}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#164B99] border border-[#164B99] rounded-md hover:bg-[#164B99] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw
              className={`w-3 h-3 ${isRestoring ? "animate-spin" : ""}`}
            />
            Restore
          </button>

          <button
            onClick={() => onDelete(backup)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-all"
            title="Delete backup"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BackupPanel() {
  const { showToast, setFolders } = useFolders();

  const supabase = createClient();

  const [backups, setBackups] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchBackups = useCallback(async () => {
    setIsLoadingList(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("backups")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      setBackups(data || []);
    } catch (err) {
      showToast("Unable to load backups", "error");
    } finally {
      setIsLoadingList(false);
    }
  }, [supabase, showToast]);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async () => {
    setIsCreating(true);

    try {
      const response = await fetch("/api/backups/create", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Backup failed");
      }

      showToast(
        `Backup created successfully (${result.snapshot.folders} folders, ${result.snapshot.files} files)`,
        "success",
      );

      await fetchBackups();
    } catch (err) {
      showToast("Unable to create backup", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!restoreTarget) return;

    const target = restoreTarget;

    setRestoreTarget(null);
    setIsRestoring(true);

    try {
      const response = await fetch("/api/backups/restore", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          backupId: target.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Restore failed");
      }

      showToast(
        `Backup restored successfully (${result.restored.folders} folders, ${result.restored.files} files)`,
        "success",
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: freshFolders } = await supabase
          .from("folders")
          .select("*, files!files_folder_id_fkey(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (freshFolders) {
          setFolders(
            freshFolders.map((f) => ({
              ...f,
              files: f.files || [],
            })),
          );
        }
      }
    } catch (err) {
      showToast("Unable to restore backup", "error");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const target = deleteTarget;

    setDeleteTarget(null);

    try {
      const response = await fetch("/api/backups/delete", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          backupId: target.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      showToast("Backup deleted successfully", "success");

      await fetchBackups();
    } catch (err) {
      showToast("Unable to delete backup", "error");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex flex-col flex-1 p-8 bg-white m-8 border-[#164B99] border-2 rounded overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="font-bold text-xl text-black">Backups</h1>

            <p className="text-xs text-gray-500 mt-0.5">
              Create and restore backups of your folders and files
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={fetchBackups}
              disabled={isLoadingList || isCreating}
              className="p-2 text-gray-400 hover:text-[#164B99] hover:bg-blue-50 rounded-md transition-all disabled:opacity-40"
              title="Refresh backups"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`}
              />
            </button>

            {/* Create Backup */}
            <button
              onClick={handleCreateBackup}
              disabled={isCreating || isLoadingList}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <DatabaseBackup className="w-4 h-4" />
                  Create Backup
                </>
              )}
            </button>
          </div>
        </div>

        {/* Backup List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingList ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <BackupSkeletonItem key={i} />
              ))}
            </div>
          ) : backups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                <DatabaseBackup className="w-7 h-7 text-[#164B99]" />
              </div>

              <p className="font-semibold text-black">No backups yet</p>

              <p className="text-xs text-gray-400 max-w-xs">
                Create your first backup to keep a safe copy of your folders and
                files.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {backups.map((backup) => (
                <BackupItem
                  key={backup.id}
                  backup={backup}
                  onRestore={setRestoreTarget}
                  onDelete={setDeleteTarget}
                  isRestoring={isRestoring}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restore Confirm Modal */}
      <ConfirmModal
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestoreConfirm}
        title="Restore Backup"
        confirmText="Restore Backup"
        message="Missing files and folders will be restored without replacing your current files."
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Backup"
        confirmText="Delete Backup"
        message="This backup will be permanently deleted."
      />
    </div>
  );
}
