"use client";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[100] p-6">
      <div className="bg-white p-6 border-4 border-black w-full max-w-sm">
        <h2 className="font-bold text-xl mb-2 text-black">{title}</h2>
        <p className="text-black mb-6">{message}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border-2 border-black font-bold hover:bg-gray-100 transition-all">
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:shadow-none active:translate-y-1 transition-all"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
