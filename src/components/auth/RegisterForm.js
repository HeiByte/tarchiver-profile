"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().min(1, "Username cannot be empty."),
    email: z.string().email("Invalid email format."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const result = registerSchema.safeParse({ username, email, password, confirmPassword });

    if (!result.success) {
      setErrorMsg(result.error.errors[0]?.message || "Invalid Input.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          data: {
            display_name: username,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center mb-6 text-primary">
        Signup
      </h1>

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <p className="text-red-500 text-xs text-center mb-4">{errorMsg}</p>
      )}

      {/* USERNAME */}
      <input
        type="text"
        placeholder="Username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Create Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* CONFIRM PASSWORD */}
      <input
        type="password"
        placeholder="Confirm Password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full border border-primary bg-primary text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all mb-4 hover:border border-primary disabled:opacity-50"
      >
        {loading ? "Processing..." : "Signup"}
      </button>

      {/* LOGIN */}
      <p className="text-center text-black mb-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Login
        </Link>
      </p>

    </form>
  );
}