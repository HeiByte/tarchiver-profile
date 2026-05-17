"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import Link from "next/link";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);

  const supabase = createClient();

  // Verify user has a valid recovery session before showing form
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSessionReady(true);
      } else {
        // No valid session — redirect
        setStatus("error");
        setMessage("Your reset link is invalid or has expired. Please request a new one.");
      }
      setChecking(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage("");

    const result = resetSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.errors[0]?.message || "Invalid input.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      // Sign out after password reset for security
      await supabase.auth.signOut();

      setStatus("success");
      setMessage("Password updated successfully! You can now log in with your new password.");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setStatus("error");
      setMessage(
        err.message?.includes("same password")
          ? "New password must be different from your current password."
          : "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white border-2 border-[#164B99] rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border-4 border-[#164B99] border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border-2 border-[#164B99] rounded-xl shadow-md p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 border-2 border-[#164B99] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#164B99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-[#164B99] mb-2">
          Reset Password
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below.
        </p>

        {/* Status message */}
        {status === "success" && (
          <div className="mb-4 px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 text-sm text-center">
            {message}
            <p className="mt-1 text-xs text-green-600">Redirecting to login...</p>
          </div>
        )}
        {status === "error" && !sessionReady && (
          <div className="mb-4 px-4 py-3 rounded-lg border-2 border-red-400 bg-red-50 text-red-600 text-sm text-center">
            {message}
          </div>
        )}
        {status === "error" && sessionReady && (
          <div className="mb-4 px-4 py-3 rounded-lg border-2 border-red-400 bg-red-50 text-red-600 text-sm text-center">
            {message}
          </div>
        )}

        {sessionReady && status !== "success" && (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg border border-[#164B99] focus:outline-none focus:ring-1 focus:ring-[#164B99] text-black"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg border border-[#164B99] focus:outline-none focus:ring-1 focus:ring-[#164B99] text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-[#164B99] bg-[#164B99] text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-[#164B99] transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {!sessionReady && (
          <Link
            href="/forgot-password"
            className="block text-center w-full border-2 border-[#164B99] bg-[#164B99] text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-[#164B99] transition-all mb-4"
          >
            Request New Reset Link
          </Link>
        )}

        <p className="text-center text-gray-500 text-sm">
          <Link href="/login" className="font-semibold text-[#164B99] hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}