"use client";
import { CheckCircle, XCircle } from "lucide-react";

export default function Notification({ message, type }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className={`fixed bottom-10 right-10 z-[200] flex items-center gap-3 px-6 py-4 rounded shadow-xl border-4 border-black font-bold animate-bounce-short transition-all ${isError ? 'bg-red-400 text-black' : 'bg-green-400 text-black'}`}>
      {isError ? <XCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
      <span>{message}</span>
    </div>
  );
}
