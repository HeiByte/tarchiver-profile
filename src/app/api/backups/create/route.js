import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function sha256Hex(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // ─── Auth ────
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // ─── Ambil data folders & files ─────
    const { data: folders, error: foldersError } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (foldersError)
      throw new Error("Failed to fetch folders: " + foldersError.message);

    const { data: files, error: filesError } = await supabase
      .from("files")
      .select(
        "id, name, original_name, extension, mime_type, folder_id, storage_path, size, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (filesError)
      throw new Error("Failed to fetch files: " + filesError.message);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // ─── Buat backup record awal  ──────
    const now = new Date();
    const timestamp = now.toISOString();
    const pad = (n) => String(n).padStart(2, "0");
    const filenameSuffix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const snapshotFileName = `backup-${filenameSuffix}.json`;

    const { data: backupRecord, error: insertError } = await supabase
      .from("backups")
      .insert([
        {
          user_id: userId,
          file_name: snapshotFileName,
          file_url: "",
          size: 0,
          status: "processing",
        },
      ])
      .select()
      .single();

    if (insertError)
      throw new Error("Failed to create backup record: " + insertError.message);

    const fileSnapshots = [];
    const copyErrors = [];

    for (const file of files || []) {
      if (!file.storage_path) {
        fileSnapshots.push({
          ...file,
          backup_hash: null,
          backup_object_path: null,
        });
        continue;
      }

      try {
        // Download file dari tarchive-bucket
        const { data: fileBlob, error: downloadErr } = await supabase.storage
          .from("tarchive-bucket")
          .download(file.storage_path);

        if (downloadErr || !fileBlob) {
          copyErrors.push(
            `${file.original_name || file.name}: not found in storage`,
          );
          fileSnapshots.push({
            ...file,
            backup_hash: null,
            backup_object_path: null,
          });
          continue;
        }

        const arrayBuffer = await fileBlob.arrayBuffer();
        const hash = await sha256Hex(arrayBuffer);
        const objectPath = `${userId}/objects/${hash}.bin`;

        // Cek apakah object dengan hash ini sudah ada (deduplikasi)
        const { data: existingList } = await supabase.storage
          .from("tarchive-backups")
          .list(`${userId}/objects`, { search: `${hash}.bin` });

        const alreadyExists = existingList?.some(
          (f) => f.name === `${hash}.bin`,
        );

        if (!alreadyExists) {
          const { error: uploadErr } = await supabase.storage
            .from("tarchive-backups")
            .upload(objectPath, fileBlob, {
              contentType: file.mime_type || "application/octet-stream",
              upsert: false,
            });

          if (uploadErr) {
            copyErrors.push(
              `${file.original_name || file.name}: upload failed - ${uploadErr.message}`,
            );
            fileSnapshots.push({
              ...file,
              backup_hash: null,
              backup_object_path: null,
            });
            continue;
          }
        }

        fileSnapshots.push({
          ...file,
          backup_hash: hash,
          backup_object_path: objectPath,
        });
      } catch (err) {
        copyErrors.push(`${file.original_name || file.name}: ${err.message}`);
        fileSnapshots.push({
          ...file,
          backup_hash: null,
          backup_object_path: null,
        });
      }
    }

    const snapshot = {
      user_id: userId,
      created_at: timestamp,
      version: 2,
      folders: folders || [],
      files: fileSnapshots,
      profile: profile || {},
      copy_errors: copyErrors.length > 0 ? copyErrors : undefined,
    };

    const snapshotBlob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const snapshotSize = snapshotBlob.size;
    const storagePath = `${userId}/${snapshotFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("tarchive-backups")
      .upload(storagePath, snapshotBlob, {
        contentType: "application/json",
        upsert: false,
      });

    if (uploadError) {
      await supabase
        .from("backups")
        .update({ status: "failed" })
        .eq("id", backupRecord.id);

      throw new Error("Failed to upload snapshot: " + uploadError.message);
    }

    const { data: signedData } = await supabase.storage
      .from("tarchive-backups")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 hari

    const fileUrl = signedData?.signedUrl || storagePath;

    const filesWithPhysicalBackup = fileSnapshots.filter(
      (f) => f.backup_hash,
    ).length;

    const { data: updatedRecord, error: updateError } = await supabase
      .from("backups")
      .update({ status: "completed", file_url: fileUrl, size: snapshotSize })
      .eq("id", backupRecord.id)
      .select()
      .single();

    if (updateError)
      throw new Error("Failed to finalize backup: " + updateError.message);

    return NextResponse.json({
      success: true,
      backup: updatedRecord,
      snapshot: {
        folders: folders?.length || 0,
        files: files?.length || 0,
        files_backed_up: filesWithPhysicalBackup,
        files_skipped: copyErrors.length,
      },
      warnings: copyErrors.length > 0 ? copyErrors : undefined,
    });
  } catch (error) {
    console.error("[BACKUP CREATE ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
