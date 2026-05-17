"use client";

import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border-2 border-red-400 rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-50 border-2 border-red-400 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-bold text-red-600 mb-3">Link Invalid</h1>
        <p className="text-gray-600 text-sm mb-6">
          The link has expired or is invalid. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block w-full border-2 border-[#164B99] bg-[#164B99] text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-[#164B99] transition-all mb-3"
        >
          Request New Reset Link
        </Link>
        <Link
          href="/login"
          className="inline-block w-full border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}