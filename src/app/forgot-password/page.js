"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email format."),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage("");

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.errors[0]?.message || "Invalid input.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=reset`,
        },
      );

      if (error) throw error;
      setStatus("success");
      setMessage(
        "If an account exists for this email, a password reset link has been sent. Please check your inbox.",
      );
    } catch (err) {
      const isRateLimit =
        err.message?.toLowerCase().includes("rate limit") ||
        err.message?.toLowerCase().includes("too many") ||
        err.status === 429;

      if (isRateLimit) {
        setStatus("error");
        setMessage(
          "Too many requests. Please wait about 2 hour before trying again.",
        );
      } else {
        setStatus("success");
        setMessage(
          "If an account exists for this email, a password reset link has been sent. Please check your inbox.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border-2 border-[#164B99] rounded-xl shadow-md p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 border-2 border-[#164B99] rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#164B99]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-[#164B99] mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        {/* Status message */}
        {status === "success" && (
          <div className="mb-4 px-4 py-3 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 text-sm text-center">
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 px-4 py-3 rounded-lg border-2 border-red-400 bg-red-50 text-red-600 text-sm text-center">
            {message}
          </div>
        )}

        {status !== "success" && (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg border border-[#164B99] focus:outline-none focus:ring-1 focus:ring-[#164B99] text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-[#164B99] bg-[#164B99] text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-[#164B99] transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#164B99] hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
