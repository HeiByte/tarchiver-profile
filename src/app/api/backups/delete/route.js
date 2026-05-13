import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
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

    const body = await request.json();
    const { backupId } = body;

    if (!backupId) {
      return NextResponse.json(
        { error: "backupId is required" },
        { status: 400 },
      );
    }

    // ─── Ambil backup record ──────
    const { data: backupRecord, error: recordError } = await supabase
      .from("backups")
      .select("*")
      .eq("id", backupId)
      .eq("user_id", userId)
      .single();

    if (recordError || !backupRecord) {
      return NextResponse.json(
        { error: "Backup not found or access denied" },
        { status: 404 },
      );
    }

    const snapshotPath = `${userId}/${backupRecord.file_name}`;
    let snapshotHashes = new Set();

    try {
      const { data: snapshotBlob } = await supabase.storage
        .from("tarchive-backups")
        .download(snapshotPath);

      if (snapshotBlob) {
        const snapshot = JSON.parse(await snapshotBlob.text());

        if (snapshot.version >= 2 && snapshot.files) {
          for (const f of snapshot.files) {
            if (f.backup_hash) snapshotHashes.add(f.backup_hash);
          }
        }
      }
    } catch {}

    const { data: otherBackups } = await supabase
      .from("backups")
      .select("file_name")
      .eq("user_id", userId)
      .neq("id", backupId)
      .eq("status", "completed");

    const stillUsedHashes = new Set();

    for (const other of otherBackups || []) {
      try {
        const { data: otherBlob } = await supabase.storage
          .from("tarchive-backups")
          .download(`${userId}/${other.file_name}`);

        if (otherBlob) {
          const otherSnapshot = JSON.parse(await otherBlob.text());
          if (otherSnapshot.version >= 2 && otherSnapshot.files) {
            for (const f of otherSnapshot.files) {
              if (f.backup_hash) stillUsedHashes.add(f.backup_hash);
            }
          }
        }
      } catch {
        // Skip backup yang tidak bisa dibaca
      }
    }

    const orphanHashes = [...snapshotHashes].filter(
      (h) => !stillUsedHashes.has(h),
    );
    const orphanPaths = orphanHashes.map((h) => `${userId}/objects/${h}.bin`);

    if (orphanPaths.length > 0) {
      await supabase.storage.from("tarchive-backups").remove(orphanPaths);
    }

    // ─── Hapus snapshot JSON ───────
    await supabase.storage.from("tarchive-backups").remove([snapshotPath]);

    // ─── Hapus record dari database ──────
    const { error: deleteError } = await supabase
      .from("backups")
      .delete()
      .eq("id", backupId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error("Failed to delete backup record: " + deleteError.message);
    }

    return NextResponse.json({
      success: true,
      cleaned_objects: orphanPaths.length,
    });
  } catch (error) {
    console.error("[BACKUP DELETE ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
