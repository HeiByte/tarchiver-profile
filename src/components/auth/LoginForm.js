"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Sama dengan Register: Ubah username input menjadi format email virtual
      const virtualEmail = `${username.toLowerCase().trim()}@tarchive.local`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: virtualEmail,
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        // Jika login sukses, arahkan ke dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      // Mapping error agar lebih user-friendly
      const message =
        err.message === "Invalid login credentials"
          ? "Username or password incorrect."
          : err.message;
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2 text-black">
        <span className="text-primary">Welcome</span> Back
      </h1>

      <p className="mb-8 text-black">Please enter your details</p>

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <p className="text-red-500 text-xs mb-4 text-center">{errorMsg}</p>
      )}

      {/* USERNAME (Input type tetap email/text sesuai style kamu) */}
      <input
        type="text"
        placeholder="Username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* PASSWORD */}
      <div className="relative mb-4">
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
        />
      </div>

      {/* ERROR */}
      {error && (<p className="text-red-500 text-sm mb-4">{error}</p>)}

      {/* FORGOT */}
      <div className="text-right mb-6">
        <Link href="#" className="text-primary text-sm hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full border border-primary bg-primary py-3 rounded-lg font-semibold hover:bg-white transition-all mb-6 hover:border border-primary hover:text-primary text-white disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Login"}
      </button>

      {/* SIGNUP */}
      <p className="text-center text-black mb-6">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Signup
        </Link>
      </p>

      {/* GOOGLE */}
      <button
        type="button"
        className="w-full border border-black py-3 rounded-lg text-black font-medium hover:bg-primary transition-all hover:text-white"
      >
        Login with Google
      </button>
    </form>
  );
}
