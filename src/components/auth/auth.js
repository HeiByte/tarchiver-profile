"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setAuthCookie() {
  const cookieStore = await cookies();

 cookieStore.set("auth", "", {
  path: "/",
  expires: new Date(0),
});
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("auth", { path: "/" });

  redirect("/");
}
