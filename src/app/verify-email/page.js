"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

function VerifyEmailPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const checkVerified = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        router.push("/dashboard");
      }
    };
    checkVerified();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || loading || cooldown > 0) return;
    setLoading(true);
    setStatus(null);
    setMessage("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=verify`,
        },
      });

      if (error) throw error;

      setStatus("success");
      setMessage("Verification email resent. Please check your inbox.");
      setCooldown(60);
    } catch (err) {
      const isRateLimit =
        err.message?.toLowerCase().includes("rate limit") ||
        err.message?.toLowerCase().includes("too many") ||
        err.status === 429;

      setStatus("error");
      setMessage(
        isRateLimit
          ? "Too many requests. Please wait about 1 hour before trying again."
          : "Failed to resend email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border-2 border-[#164B99] rounded-xl shadow-md p-8">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-[#164B99] mb-2">
          Verify Your Email
        </h1>

        <p className="text-center text-gray-600 text-sm mb-2">
          We sent a verification link to:
        </p>
        {email && (
          <p className="text-center font-semibold text-black text-sm mb-6 truncate">
            {email}
          </p>
        )}

        <p className="text-center text-gray-500 text-sm mb-6">
          Please check your email and click the verification link to activate
          your account.
        </p>

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

        <button
          onClick={handleResend}
          disabled={loading || cooldown > 0}
          className="w-full border-2 border-[#164B99] bg-[#164B99] text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-[#164B99] transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend Verification Email"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#164B99] hover:underline"
          >
            Sign up again
          </Link>
        </p>

        <p className="text-center text-gray-500 text-sm mt-2">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#164B99] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageInner />
    </Suspense>
  );
}