import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // ─── Auth ──────
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

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

    // ─── Buat snapshot ─────────────
    const now = new Date();
    const timestamp = now.toISOString();
    const pad = (n) => String(n).padStart(2, "0");
    const filenameSuffix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const snapshotFileName = `backup-${filenameSuffix}.json`;
    const storagePath = `${userId}/${snapshotFileName}`;

    const snapshot = {
      user_id: userId,
      created_at: timestamp,
      folders: folders || [],
      files: (files || []).map((f) => ({
        id: f.id,
        name: f.name,
        original_name: f.original_name,
        extension: f.extension,
        mime_type: f.mime_type,
        folder_id: f.folder_id,
        storage_path: f.storage_path,
        size: f.size,
        created_at: f.created_at,
      })),
      profile: profile || {},
    };

    const snapshotBlob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });

    const snapshotSize = snapshotBlob.size;

    const { data: backupRecord, error: insertError } = await supabase
      .from("backups")
      .insert([
        {
          user_id: userId,
          file_name: snapshotFileName,
          file_url: "",
          size: snapshotSize,
          status: "processing",
        },
      ])
      .select()
      .single();

    if (insertError)
      throw new Error("Failed to create backup record: " + insertError.message);

    // ─── Upload snapshot ke tarchive-backups ──────────────
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

    const { data: signedData, error: signedError } = await supabase.storage
      .from("tarchive-backups")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days

    const fileUrl = signedData?.signedUrl || storagePath;

    const { data: updatedRecord, error: updateError } = await supabase
      .from("backups")
      .update({ status: "completed", file_url: fileUrl })
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
      },
    });
  } catch (error) {
    console.error("[BACKUP CREATE ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
