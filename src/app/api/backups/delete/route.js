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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = user.id;

    // ─── Request Body ──────
    const body = await request.json();

    const { backupId } = body;

    if (!backupId) {
      return NextResponse.json(
        { error: "backupId is required" },
        { status: 400 },
      );
    }

    // ─── Get Backup Record ──────
    const { data: backupRecord, error: backupError } =
      await supabase
        .from("backups")
        .select("*")
        .eq("id", backupId)
        .eq("user_id", userId)
        .single();

    if (backupError || !backupRecord) {
      return NextResponse.json(
        { error: "Backup not found or access denied" },
        { status: 404 },
      );
    }

    // ─── Delete Snapshot File From Storage ──────
    const storagePath = `${userId}/${backupRecord.file_name}`;

    const { error: storageError } = await supabase.storage
      .from("tarchive-backups")
      .remove([storagePath]);

    if (storageError) {
      throw new Error(
        "Failed to delete backup file: " +
          storageError.message,
      );
    }

    // ─── Delete Backup Record ──────
    const { error: deleteError } = await supabase
      .from("backups")
      .delete()
      .eq("id", backupId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(
        "Failed to delete backup record: " +
          deleteError.message,
      );
    }

    return NextResponse.json({
      success: true,
      deletedBackupId: backupId,
    });
  } catch (error) {
    console.error("[BACKUP DELETE ERROR]", error);

    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}