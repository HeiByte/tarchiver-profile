import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ─── GET /api/files/[fileId]/download ────
export async function GET(request, { params }) {
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

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_SUPABASE_ROLE_KEY,
    );

    const { data: fileRecord, error: fetchError } = await adminSupabase
      .from("files")
      .select("id, user_id, storage_path, original_name, name")
      .eq("id", fileId)
      .single();

    if (fetchError || !fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (fileRecord.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: signedData, error: signedError } = await adminSupabase.storage
      .from("tarchive-bucket")
      .createSignedUrl(fileRecord.storage_path, 60);

    if (signedError) throw signedError;

    return NextResponse.json(
      {
        url: signedData.signedUrl,
        filename: fileRecord.original_name || fileRecord.name,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: err.message || "Download failed" },
      { status: 500 },
    );
  }
}
