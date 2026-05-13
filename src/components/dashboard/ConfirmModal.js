"use client";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "bg-blue-600 hover:bg-blue-500",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[100000] p-6">
      <div className="bg-white p-6 rounded-md w-full max-w-sm">
        <h2 className="font-bold text-xl mb-2 text-black">{title}</h2>

        <p className="text-black mb-6">{message}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-400 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded transition-all active:translate-y-1 ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
