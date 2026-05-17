"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password cannot be empty."),
});

const updateProfileSchema = z.object({
  name: z.string().max(100, "Max 100 characters.").optional(),
  address: z.string().max(255, "Max 255 characters.").optional(),
  email: z
    .union([z.literal(""), z.string().email("Invalid email format.")])
    .optional(),
  job: z.string().max(100, "Max 100 characters.").optional(),
});

export async function login(email, password) {
  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    const firstError = result.error.errors[0]?.message || "Invalid Input.";
    return { success: false, error: firstError };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password: password,
  });

  if (error) {
    return { success: false, error: "Incorrect email or password." };
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      updated_at: new Date().toISOString(),
    });
  }

  return {
    id: user.id,
    username: user.user_metadata?.display_name || user.email.split("@")[0],
    name: profile?.full_name || "",
    address: profile?.address || "",
    email: profile?.email || user.email || "",
    job: profile?.job || "",
  };
}

export async function updateProfile(fields) {
  const result = updateProfileSchema.safeParse(fields);

  if (!result.success) {
    const firstError = result.error.errors[0]?.message || "Invalid Input.";
    throw new Error(firstError);
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fields.name,
      address: fields.address,
      email: fields.email,
      job: fields.job,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  const allCookies = cookieStore.getAll();
  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}
