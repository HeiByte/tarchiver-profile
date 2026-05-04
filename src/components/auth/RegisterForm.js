"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Keamanan Dasar: Validasi Client-side
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Trick: Ubah username jadi email virtual agar privasi terjaga
      const virtualEmail = `${username.toLowerCase().trim()}@tarchive.local`;

      const { data, error } = await supabase.auth.signUp({
        email: virtualEmail,
        password: password,
        options: {
          data: {
            display_name: username, // Simpan username asli di metadata
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err.message || "An error occurred during signup");
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

      {/* Tampilan Error (Jika ada) */}
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

      {/* GOOGLE */}
      <button
        type="button"
        className="w-full border border-primary py-3 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all"
      >
        Login with Google
      </button>
    </form>
  );
}
