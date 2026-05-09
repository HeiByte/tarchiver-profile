"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(username, password) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const virtualEmail = `${username.toLowerCase().trim()}@tarchive.local`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: virtualEmail,
    password: password,
  });

  if (error) {
    return { success: false, error: "Username atau password salah." };
  }

  // Set cookie manual untuk tugas middleware
  cookieStore.set("auth_session", "active", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function getUserProfile() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.email.split('@')[0],
    name: user.user_metadata?.full_name || "Tanpa Nama",
  };
}

export async function updateProfile(newName) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: newName }
  });

  if (error) throw error;
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  // Hapus semua cookie
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    cookieStore.delete(cookie.name);
  });

  redirect("/");
}
