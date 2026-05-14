import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STORAGE_LIMIT_BYTES = 262144000; // 250MB

export async function GET() {
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

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_SUPABASE_ROLE_KEY,
    );

    // hitung jumlah files
    const { data: filesData, error: filesError } = await adminSupabase
      .from("files")
      .select("size")
      .eq("user_id", user.id);

    if (filesError) throw filesError;

    // Sum jumlah backups
    const { data: backupsData, error: backupsError } = await adminSupabase
      .from("backups")
      .select("size")
      .eq("user_id", user.id);

    if (backupsError) throw backupsError;

    const filesUsed = (filesData || []).reduce(
      (acc, f) => acc + (f.size || 0),
      0,
    );
    const backupsUsed = (backupsData || []).reduce(
      (acc, b) => acc + (b.size || 0),
      0,
    );

    const totalUsed = filesUsed + backupsUsed;

    return NextResponse.json({
      used: totalUsed,
      filesUsed,
      backupsUsed,
      limit: STORAGE_LIMIT_BYTES,
      remaining: Math.max(0, STORAGE_LIMIT_BYTES - totalUsed),
      percentUsed: Math.min(100, (totalUsed / STORAGE_LIMIT_BYTES) * 100),
    });
  } catch (err) {
    console.error("Storage usage error:", err);
    return NextResponse.json(
      { error: "Failed to fetch storage usage" },
      { status: 500 },
    );
  }
}
