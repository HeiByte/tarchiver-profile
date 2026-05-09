"use client";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[100] p-6">
      <div className="bg-white p-6 rounded-md w-full max-w-sm">
        <h2 className="font-bold text-xl mb-2 text-black">{title}</h2>
        <p className="text-black mb-6">{message}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-red-500 hover:text-red-400 transition-all">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded   hover:bg-blue-400 active:shadow-none active:translate-y-1 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
