"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await login(email, password);

      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else if (res.unverified) {
        router.push(`/verify-email?email=${encodeURIComponent(res.email)}`);
      } else {
        setErrorMsg(res.error);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat login.");
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

      {/* FORGOT */}
      <div className="text-right mb-6">
        <Link href="/forgot-password" className="text-primary text-sm hover:underline">
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
    </form>
  );
}