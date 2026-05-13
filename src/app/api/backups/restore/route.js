import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // ─── Auth ────────
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const body = await request.json();
    const { backupId } = body;

    if (!backupId) {
      return NextResponse.json(
        { error: "backupId is required" },
        { status: 400 },
      );
    }

    const { data: backupRecord, error: recordError } = await supabase
      .from("backups")
      .select("*")
      .eq("id", backupId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single();

    if (recordError || !backupRecord) {
      return NextResponse.json(
        { error: "Backup not found or access denied" },
        { status: 404 },
      );
    }

    const storagePath = `${userId}/${backupRecord.file_name}`;

    const { data: downloadData, error: downloadError } = await supabase.storage
      .from("tarchive-backups")
      .download(storagePath);

    if (downloadError || !downloadData) {
      return NextResponse.json(
        {
          error:
            "Failed to download snapshot: " +
            (downloadError?.message || "unknown"),
        },
        { status: 500 },
      );
    }

    const snapshotText = await downloadData.text();
    let snapshot;

    try {
      snapshot = JSON.parse(snapshotText);
    } catch {
      return NextResponse.json(
        { error: "Snapshot file is corrupted" },
        { status: 500 },
      );
    }

    if (snapshot.user_id !== userId) {
      return NextResponse.json(
        { error: "Snapshot ownership mismatch" },
        { status: 403 },
      );
    }

    const { folders: snapshotFolders = [], files: snapshotFiles = [] } =
      snapshot;

    const { data: existingFolders } = await supabase
      .from("folders")
      .select("id")
      .eq("user_id", userId);

    const { data: existingFiles } = await supabase
      .from("files")
      .select("id")
      .eq("user_id", userId);

    const existingFolderIds = new Set((existingFolders || []).map((f) => f.id));
    const existingFileIds = new Set((existingFiles || []).map((f) => f.id));

    const errors = [];
    let foldersRestored = 0;
    let filesRestored = 0;

    const foldersToInsert = snapshotFolders.filter(
      (f) => !existingFolderIds.has(f.id),
    );

    if (foldersToInsert.length > 0) {
      const { error: folderInsertError } = await supabase
        .from("folders")
        .upsert(
          foldersToInsert.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type || "all",
            user_id: userId,
            created_at: f.created_at,
          })),
          { onConflict: "id", ignoreDuplicates: true },
        );

      if (folderInsertError) {
        errors.push("Folder restore error: " + folderInsertError.message);
      } else {
        foldersRestored = foldersToInsert.length;
      }
    }

    const filesToRestore = snapshotFiles.filter(
      (f) => !existingFileIds.has(f.id),
    );

    for (const file of filesToRestore) {
      if (!file.storage_path) {
        errors.push(`File ${file.name} skipped: no storage_path`);
        continue;
      }

      const { data: fileCheck, error: fileCheckError } = await supabase.storage
        .from("tarchive-bucket")
        .list(file.storage_path.split("/").slice(0, -1).join("/"), {
          search: file.storage_path.split("/").pop(),
        });

      const physicalExists =
        !fileCheckError &&
        fileCheck?.some((f) => f.name === file.storage_path.split("/").pop());

      if (!physicalExists) {
        errors.push(
          `File ${file.original_name || file.name} skipped: physical file not found in storage`,
        );
        continue;
      }

      const { error: fileInsertError } = await supabase.from("files").upsert(
        {
          id: file.id,
          name: file.name,
          original_name: file.original_name,
          extension: file.extension,
          mime_type: file.mime_type,
          folder_id: file.folder_id,
          user_id: userId,
          storage_path: file.storage_path,
          size: file.size,
          created_at: file.created_at,
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

      if (fileInsertError) {
        errors.push(
          `File ${file.name} restore error: ` + fileInsertError.message,
        );
      } else {
        filesRestored++;
      }
    }

    return NextResponse.json({
      success: true,
      restored: {
        folders: foldersRestored,
        files: filesRestored,
      },
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[BACKUP RESTORE ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
