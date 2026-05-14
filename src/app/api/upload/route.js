import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STORAGE_LIMIT_BYTES = 262144000; // 250MB

const uploadLocks = new Map();

async function acquireLock(userId) {
  const existing = uploadLocks.get(userId);
  if (existing) {
    await Promise.race([
      existing,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Lock timeout")), 15000),
      ),
    ]).catch(() => {});
  }

  let releaseLock;
  const lockPromise = new Promise((resolve) => {
    releaseLock = resolve;
  });

  uploadLocks.set(userId, lockPromise);

  return () => {
    releaseLock();
    uploadLocks.delete(userId);
  };
}

async function getTotalStorageUsed(adminSupabase, userId) {
  const [filesResult, backupsResult] = await Promise.all([
    adminSupabase.from("files").select("size").eq("user_id", userId),
    adminSupabase.from("backups").select("size").eq("user_id", userId),
  ]);

  if (filesResult.error) throw filesResult.error;
  if (backupsResult.error) throw backupsResult.error;

  const filesTotal = (filesResult.data || []).reduce(
    (acc, f) => acc + (f.size || 0),
    0,
  );
  const backupsTotal = (backupsResult.data || []).reduce(
    (acc, b) => acc + (b.size || 0),
    0,
  );

  return filesTotal + backupsTotal;
}

export async function POST(request) {
  let releaseLock = null;

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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file");
    const folderId = formData.get("folderId");
    const folderName = formData.get("folderName");
    const folderType = formData.get("folderType");
    const fileCount = parseInt(formData.get("fileCount") || "0", 10);

    if (!file || !folderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileSize = fileBuffer.byteLength;

    releaseLock = await acquireLock(user.id);

    // RE-CHECK storage (double validation)
    const totalUsed = await getTotalStorageUsed(adminSupabase, user.id);

    if (totalUsed + fileSize > STORAGE_LIMIT_BYTES) {
      return NextResponse.json(
        {
          error:
            "Storage quota exceeded. Maximum storage is 250MB per user. Please delete some files or backups to free up space.",
          used: totalUsed,
          limit: STORAGE_LIMIT_BYTES,
          fileSize,
        },
        { status: 413 },
      );
    }

    // Build storage path
    const fileSequence = String(fileCount + 1).padStart(2, "0");
    const extMatch = file.name.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1] : "";
    const folderStr = (folderName || "UNKNOWN")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_");
    const d = new Date();
    const tglStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const generatedName = `${fileSequence}_${folderStr}_${tglStr}${ext ? "." + ext : ""}`;
    const storagePath = `${user.id}/${folderId}/${generatedName}`;

    // Upload via service
    const { error: storageError } = await adminSupabase.storage
      .from("tarchive-bucket")
      .upload(storagePath, fileBuffer, {
        upsert: true,
        contentType: file.type,
      });

    if (storageError) throw storageError;

    // Insert file record
    const { data: dbData, error: dbError } = await adminSupabase
      .from("files")
      .insert([
        {
          name: generatedName,
          original_name: file.name,
          extension: ext,
          mime_type: file.type,
          folder_id: parseInt(folderId, 10),
          user_id: user.id,
          storage_path: storagePath,
          size: fileSize,
        },
      ])
      .select()
      .single();

    if (dbError) {
      // remove uploaded file dari storage
      await adminSupabase.storage.from("tarchive-bucket").remove([storagePath]);
      throw dbError;
    }

    return NextResponse.json({ file: dbData }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);

    if (err.message === "Lock timeout") {
      return NextResponse.json(
        {
          error: "Another upload is in progress. Please wait and try again.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 },
    );
  } finally {
    if (releaseLock) releaseLock();
  }
}
