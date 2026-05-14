import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_SUPABASE_ROLE_KEY,
  );
}

// ─── DELETE /api/files/[fileId] ──────
export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await params;
    const adminSupabase = await getAdminClient();

    // Ambil file record 
    const { data: fileRecord, error: fetchError } = await adminSupabase
      .from("files")
      .select("id, user_id, storage_path, folder_id")
      .eq("id", fileId)
      .single();

    if (fetchError || !fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // user hanya bisa hapus file miliknya sendiri
    if (fileRecord.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Hapus dari storage
    if (fileRecord.storage_path) {
      const { error: storageError } = await adminSupabase.storage
        .from("tarchive-bucket")
        .remove([fileRecord.storage_path]);

      if (storageError) throw storageError;
    }

    // Hapus dari database
    const { error: dbError } = await adminSupabase
      .from("files")
      .delete()
      .eq("id", fileId);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 },
    );
  }
}
