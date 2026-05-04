"use client";
import { CheckCircle, XCircle } from "lucide-react";

export default function Notification({ message, type }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className={`fixed bottom-10 right-10 z-[200] flex items-center gap-3 px-6  font-bold animate-bounce-short transition-all ${isError ? ' text-red-600' : 'text-green-500'}`}>
      {isError ? <XCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
      <span>{message}</span>
    </div>
  );
}
